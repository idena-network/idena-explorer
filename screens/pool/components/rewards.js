import {useInfiniteQuery} from 'react-query'
import {Fragment} from 'react'
import Link from 'next/link'
import {getPoolTotalRewards} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {epochFmt, precise6} from '../../../shared/utils/utils'

const LIMIT = 30

export default function Rewards({address, visible}) {
  const fetchRewards = (_, address, continuationToken = null) =>
    getPoolTotalRewards(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && [`${address}/poolTotalRewards`, address],
    fetchRewards,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const getReward = (arr, type) => {
    const item = arr.find((x) => x.type === type)
    if (!item) {
      return 0
    }
    return item.balance * 1
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Delegators</th>
            <th>
              Validation
              <br />
              reward,
              <br />
              iDNA
            </th>
            <th>
              Flips
              <br />
              reward,
              <br />
              iDNA
            </th>
            <th>
              Invitation
              <br />
              reward,
              <br />
              iDNA
            </th>
            <th style={{width: 80}}>
              Total
              <br />
              reward,
              <br />
              iDNA
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {data &&
            data.map((page, i) => (
              <Fragment key={i}>
                {page &&
                  page.map((item) => {
                    const validationReward = getReward(
                      item.rewards,
                      'Validation'
                    )
                    const invitaionReward =
                      getReward(item.rewards, 'Invitations') +
                      getReward(item.rewards, 'Invitations2') +
                      getReward(item.rewards, 'Invitations3')

                    const flipsReward =
                      getReward(item.rewards, 'Flips') +
                      getReward(item.rewards, 'Reports')

                    return (
                      <tr key={item.epoch}>
                        <td>
                          <div className="text_block text_block--ellipsis">
                            <Link
                              href="/pool/[address]/epoch/[epoch]/rewards"
                              as={`/pool/${address}/epoch/${
                                item.epoch + 1
                              }/rewards`}
                            >
                              <a>{epochFmt(item.epoch + 1)}</a>
                            </Link>
                          </div>
                        </td>
                        <td>{item.delegators}</td>
                        <td>{precise6(validationReward) || '-'}</td>
                        <td>{precise6(flipsReward) || '-'}</td>
                        <td>{precise6(invitaionReward) || '-'}</td>
                        <td>
                          {precise6(
                            item.rewards.reduce(
                              (prev, cur) => prev + cur.balance * 1,
                              0
                            )
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </Fragment>
            ))}
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
