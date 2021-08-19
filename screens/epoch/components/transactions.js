import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {useEffect, useState} from 'react'
import {
  timeSince,
  precise6,
  dnaFmt,
  epochFmt,
  txTypeFmt,
} from '../../../shared/utils/utils'
import {
  getEpochTransactions,
  getEpochTransactionsCount,
} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {WarningTooltip} from '../../../shared/components/tooltip'

export default function Transactions({epoch, visible, limit = 30}) {
  const [lastTx, setLastTx] = useState(null)

  const fetchTransactions = (_, epoch, continuationToken = null) =>
    getEpochTransactions(epoch, limit, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && `${epoch}/transactions`,
    [epoch],
    (_, epoch, continuationToken) =>
      fetchTransactions(_, epoch, continuationToken).then((data) => {
        data.forEach((element) => {
          element.isNew = lastTx && new Date(element.timestamp) > lastTx
        })
        return data
      }),
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
      refetchInterval: 20 * 1000,
    }
  )

  useEffect(() => {
    if (data && data.length && data[0].length) {
      setLastTx(new Date(data[0][0].timestamp))
    }
  }, [data])

  const {data: txsCount} = useQuery(
    epoch > 0 && ['epoch/txsCount', epoch],
    (_, epoch) => getEpochTransactionsCount(epoch),
    {
      refetchInterval: 60 * 1000,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th style={{width: 100}}>Timestamp</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th style={{width: 100}}>Type</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.hash} className={item.isNew ? 'new-tx' : ''}>
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
                  <td>{timeSince(item.timestamp)}</td>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${
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
                            src={`https://robohash.idena.io/${item.to.toLowerCase()}`}
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
                      (!item.txReceipt || item.txReceipt.success) &&
                        precise6(
                          !(item.amount * 1) &&
                            typeof item.transfer !== 'undefined'
                            ? item.transfer
                            : (!item.txReceipt || item.txReceipt.success) &&
                                item.amount
                        ),
                      ''
                    )}
                  </td>
                  <td>
                    {item.txReceipt && !item.txReceipt.success && (
                      <WarningTooltip
                        tooltip={`Smart contract failed: ${item.txReceipt.errorMsg}`}
                        placement="top"
                        style={{marginRight: '5px'}}
                      />
                    )}
                    {txTypeFmt(item.type, item.data)}
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
          Show more txs (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {txsCount}) in epoch {epochFmt(epoch)}
        </button>
      </div>
      <style jsx>
        {`
          .new-tx {
            animation: highlight 2000ms ease-out;
          }
          @keyframes highlight {
            0% {
              background-color: #f5f6f7;
            }
            100% {
              background-color: white;
            }
          }
        `}
      </style>
    </div>
  )
}
