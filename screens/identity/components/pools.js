import {useInfiniteQuery} from 'react-query'
import Link from 'next/link'
import {getAddressDelegations} from '../../../shared/api'
import {dateTimeFmt, undelegationReasonFmt} from '../../../shared/utils/utils'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 10

export default function Pools({address, visible}) {
  const fetchDelegations = (_, address, continuationToken = null) =>
    getAddressDelegations(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `${address}/pools`,
    [address],
    fetchDelegations,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Pool address</th>
            <th>Start delegation</th>
            <th>End delegation</th>
            <th>Delegation tx</th>
            <th>Undelegation tx</th>
            <th>Undelegation reason</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.delegationTx.hash}>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${item.delegateeAddress.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 120}}
                    >
                      <Link
                        href="/pool/[address]"
                        as={`/pool/${item.delegateeAddress}`}
                      >
                        <a>{item.delegateeAddress}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dateTimeFmt(item.delegationTx.timestamp)}</td>
                  <td>
                    {item.undelegationTx
                      ? dateTimeFmt(item.undelegationTx.timestamp)
                      : item.undelegationBlock
                      ? dateTimeFmt(item.undelegationBlock.timestamp)
                      : '-'}
                  </td>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 120}}
                    >
                      <Link
                        href="/transaction/[hash]"
                        as={`/transaction/${item.delegationTx.hash}`}
                      >
                        <a>{item.delegationTx.hash}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    {item.undelegationTx ? (
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: 120}}
                      >
                        <Link
                          href="/transaction/[hash]"
                          as={`/transaction/${item.undelegationTx.hash}`}
                        >
                          <a>{item.undelegationTx.hash}</a>
                        </Link>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {undelegationReasonFmt(item.undelegationReason) || '-'}
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
