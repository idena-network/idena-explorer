import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {
  dateTimeFmt,
  precise6,
  dnaFmt,
  txTypeFmt,
} from '../../../shared/utils/utils'
import {getBlockTransactions} from '../../../shared/api'
import {WarningTooltip} from '../../../shared/components/tooltip'

const LIMIT = 10

export default function Transactions({block}) {
  const fetchTransactions = (_, block, continuationToken = null) =>
    getBlockTransactions(block, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore} = useInfiniteQuery(
    block && `${block}/transactions`,
    [block],
    fetchTransactions,
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
            <th>Transaction</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th style={{width: 100}}>Timestamp</th>
            <th style={{width: 100}}>Type</th>
          </tr>
        </thead>
        <tbody>
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
                  <td>{dateTimeFmt(item.timestamp)}</td>
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
          Show more
        </button>
      </div>
    </div>
  )
}
