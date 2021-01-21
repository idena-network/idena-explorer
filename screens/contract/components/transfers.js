import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {precise6, dnaFmt, dateFmt, timeFmt} from '../../../shared/utils/utils'
import {getContractBalanceUpdates} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Transfers({address}) {
  const fetchTransfers = (_, address, continuationToken = null) =>
    getContractBalanceUpdates(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && `${address}/transfers`,
    [address],
    fetchTransfers,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const prepareTransferInfo = (item, contractAddress) => {
    const contractMethodFmt = ({type, contractCallMethod}) => {
      if (!type) return ''
      if (type !== 'CallContract') {
        return type
      }
      if (!contractCallMethod) return ''
      return contractCallMethod
    }
    const transferAmount = (item) => {
      if (!item) return 0
      const balanceChange = item.balanceChange ? item.balanceChange * 1 : 0
      if (item.from !== item.address) return balanceChange
      return balanceChange - item.amount * 1
    }
    const txFee = (item) => {
      if (!item || item.from !== item.address) return 0
      return item.fee * 1 + item.tips * 1
    }
    const method = contractMethodFmt(item)
    let amount = transferAmount(item)
    const from = amount > 0 ? contractAddress : item.address
    let to = amount <= 0 ? contractAddress : item.address
    if (
      from.toLowerCase() === contractAddress.toLowerCase() &&
      to.toLowerCase() === contractAddress.toLowerCase()
    ) {
      to = ''
    }
    const fee = txFee(item)
    amount = Math.abs(amount)
    return {amount, method, from, to, fee}
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Timestamp</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && <SkeletonRows cols={7} />}
          {data.map(
            (page) =>
              page &&
              page.map((item) => {
                const transferInfo = prepareTransferInfo(item, address)
                return (
                  <tr key={`${item.hash}_${item.address}`}>
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
                            transferInfo.from && transferInfo.from.toLowerCase()
                          }`}
                          alt="pic"
                          width="32"
                        />
                      </div>
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: 100}}
                      >
                        {address.toLowerCase() ===
                        transferInfo.from.toLowerCase() ? (
                          transferInfo.from
                        ) : (
                          <Link
                            href="/address/[address]"
                            as={`/address/${transferInfo.from}`}
                          >
                            <a>{transferInfo.from}</a>
                          </Link>
                        )}
                      </div>
                    </td>
                    <td>
                      {transferInfo.to ? (
                        <>
                          <div className="user-pic">
                            <img
                              src={`https://robohash.org/${transferInfo.to.toLowerCase()}`}
                              alt="pic"
                              width="32"
                            />
                          </div>
                          <div
                            className="text_block text_block--ellipsis"
                            style={{width: 100}}
                          >
                            {address.toLowerCase() ===
                            transferInfo.to.toLowerCase() ? (
                              transferInfo.to
                            ) : (
                              <Link
                                href="/address/[address]"
                                as={`/address/${transferInfo.to}`}
                              >
                                <a>{transferInfo.to}</a>
                              </Link>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text_block text_block--ellipsis">-</div>
                      )}
                    </td>
                    <td>{dnaFmt(precise6(transferInfo.amount), '')}</td>
                    <td>{dnaFmt(precise6(transferInfo.fee), '')}</td>
                    <td className="multiline">
                      {dateFmt(item.timestamp)}
                      <br />
                      {timeFmt(item.timestamp)}
                    </td>
                    <td>{transferInfo.method}</td>
                  </tr>
                )
              })
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
