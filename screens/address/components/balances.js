import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {dateTimeFmt, precise2} from '../../../shared/utils/utils'
import {getBalanceChanges} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function BalanceHistory({address, visible}) {
  const fetchBalances = (_, continuationToken = null) =>
    getBalanceChanges(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && address && `${address}/balance/changes`,
    fetchBalances,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  function reasonFmt(reason) {
    if (reason === 'Tx') return 'Transaction'
    if (reason === 'VerifiedStake') return 'Stake unlocked'
    if (reason === 'ProposerReward') return 'Block issued'
    if (reason === 'CommitteeReward') return 'Blocks verified'
    if (reason === 'EpochReward') return 'Validation reward'
    if (reason === 'FailedValidation') return 'Validation failed'
    if (reason === 'Penalty') return 'Mining penalty'
    if (reason === 'EpochPenaltyReset') return 'New epoch'
    if (reason === 'EmbeddedContract') return 'Smart contract'
    if (reason === 'DustClearing') return 'Clean small balance'
    if (reason === 'Initial') return 'Initial balance'
    return reason
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>
              Balance/change,
              <br />
              iDNA
            </th>
            <th>
              Stake/change,
              <br />
              iDNA
            </th>
            <th>
              Mining penalty,
              <br />
              iDNA
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={5} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.address}>
                  <td>
                    {dateTimeFmt(item.timestamp)}
                    {item.data && item.data.lastBlockTimestamp && (
                      <span>
                        {' -'}
                        <br />
                        {dateTimeFmt(item.data.lastBlockTimestamp)}
                      </span>
                    )}
                  </td>

                  <td>
                    <ValueChange
                      newValue={item.balanceNew}
                      oldValue={item.balanceOld}
                    />
                  </td>
                  <td>
                    <ValueChange
                      newValue={item.stakeNew}
                      oldValue={item.stakeOld}
                    />
                  </td>
                  <td>
                    {!item.penaltySecondsOld && !item.penaltySecondsNew ? (
                      <ValueChange
                        newValue={item.penaltyNew}
                        oldValue={item.penaltyOld}
                        isNegativeChange
                      />
                    ) : (
                      <PenaltyChange penaltyPayment={item.penaltyPayment} />
                    )}
                  </td>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 180}}
                    >
                      {reasonFmt(item.reason)}
                      {item.data && item.data.blocksCount && (
                        <span>
                          <br />
                          Total blocks: {item.data.blocksCount}
                        </span>
                      )}
                      {item.data && item.data.txHash && (
                        <span>
                          <br />
                          <Link
                            href="/transaction/[hash]"
                            as={`/transaction/${item.data.txHash}`}
                          >
                            <a>{item.data.txHash}</a>
                          </Link>
                        </span>
                      )}

                      {item.reason === 'ProposerReward' && (
                        <span>
                          <br />
                          <Link
                            href="/block/[hash]"
                            as={`/block/${item.blockHash}`}
                          >
                            <a>{item.blockHash}</a>
                          </Link>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      <div
        className="text-center"
        style={{display: canFetchMore ? 'block' : 'none'}}
      >
        <button
          type="button"
          className="btn btn-small"
          onClick={() => fetchMore()}
        >
          Show more
        </button>
      </div>
    </div>
  )
}

function ValueChange({oldValue, newValue, isNegativeChange = false}) {
  const changeValue = Math.round((newValue - oldValue) * 10000) / 10000
  return (
    <div>
      {changeValue !== 0 && (
        <span>
          <span>{precise2(newValue)}</span>
          <span style={{padding: '4px'}} />
          <span
            style={{
              color: `${
                (changeValue > 0 && !isNegativeChange) ||
                (changeValue < 0 && isNegativeChange)
                  ? '#27d980'
                  : '#ff6666'
              }`,
            }}
          >
            <span style={{verticalAlign: 'middle', fontSize: '9px'}}>
              {`${changeValue > 0 ? '▲' : '▼'}  `}
            </span>
            {`${Math.abs(changeValue)}`}
          </span>
        </span>
      )}
      {!changeValue && (
        <span style={{color: '#96999e'}}>{precise2(newValue)}</span>
      )}
    </div>
  )
}

function PenaltyChange({penaltyPayment}) {
  const payment = Math.round(penaltyPayment * 10000) / 10000
  return (
    <div>
      <span
        style={{
          color: `${payment !== 0 ? '#ff6666' : '#96999e'}`,
        }}
      >
        {payment}
      </span>
    </div>
  )
}
