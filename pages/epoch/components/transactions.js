import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {
  dateTimeFmt,
  precise6,
  dnaFmt,
  txTypeFmt,
} from '../../../shared/utils/utils'
import {
  getEpochTransactions,
  getEpochTransactionsCount,
} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Transactions({epoch, visible}) {
  const fetchTransactions = (_, epoch, skip = 0) =>
    getEpochTransactions(epoch, skip, LIMIT)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    `${epoch}/transactions`,
    [epoch],
    fetchTransactions,
    {
      getFetchMore: (lastGroup, allGroups) =>
        lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false,
    }
  )

  const {data: txsCount} = useQuery(['epoch/txsCount', epoch], (_, epoch) =>
    getEpochTransactionsCount(epoch)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th style={{width: 100}}>Timestamp</th>
            <th style={{width: 100}}>Type</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.hash}>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 100}}
                    >
                      <Link
                        href="/transaction/[hash]"
                        as={`/transaction/${item.hash}`}
                      >
                        <a>{item.hash}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.org/${
                          item.from && item.from.toLowerCase()
                        }`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 120}}
                    >
                      <Link
                        href="/address/[address]"
                        as={`/address/${item.from}`}
                      >
                        <a>{item.from}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    {item.to ? (
                      <>
                        <div className="user-pic">
                          <img
                            src={`https://robohash.org/${item.to.toLowerCase()}`}
                            alt="pic"
                            width="32"
                          />
                        </div>
                        <div
                          className="text_block text_block--ellipsis"
                          style={{width: 120}}
                        >
                          <Link
                            href="/address/[address]"
                            as={`/address/${item.to}`}
                          >
                            <a>{item.to}</a>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text_block text_block--ellipsis">-</div>
                    )}
                  </td>
                  <td>
                    {dnaFmt(
                      precise6(
                        !(item.amount * 1) &&
                          typeof item.transfer !== 'undefined'
                          ? item.transfer
                          : item.amount
                      ),
                      ''
                    )}
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
                  <td>{txTypeFmt(item.type, item.data)}</td>
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
          Show more (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {txsCount})
        </button>
      </div>
    </div>
  )
}
