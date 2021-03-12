import Link from 'next/link'
import {useEffect, useState} from 'react'
import {precise6, dnaFmt, txTypeFmt} from '../../../shared/utils/utils'
import {getMempoolTxs} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {WarningTooltip} from '../../../shared/components/tooltip'

export default function Mempool({visible, limit = 20}) {
  const [data, setData] = useState([])
  const [status, setStatus] = useState('')
  useEffect(() => {
    async function getData() {
      setStatus('loading')
      const mempoolTxs = await getMempoolTxs(limit)
      setStatus('')
      setData(mempoolTxs)
    }
    getData()
  }, [limit])

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
          {data &&
            data.map((item) => (
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
                <td>Mining...</td>
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
                    precise6(
                      !(item.amount * 1) && typeof item.transfer !== 'undefined'
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
            ))}
        </tbody>
      </table>
    </div>
  )
}
