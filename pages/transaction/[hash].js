import {useQuery} from 'react-query'
import Link from 'next/link'
import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import {getTransaction} from '../../shared/api'
import {PageLoading, PageError} from '../../shared/components/loading'
import {
  dnaFmt,
  dateTimeFmt,
  epochFmt,
  txTypeFmt,
  isContractTx,
} from '../../shared/utils/utils'

function Tx() {
  const router = useRouter()
  const hash = router.query.hash || ''

  const {data: txData, error, status} = useQuery(hash, getTransaction)
  const {data: rawTxData} = useQuery(hash && `${hash}/raw`, getTransaction)

  return (
    <Layout title={`Transaction ${hash}`}>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Transaction</h1>
          <h3 className="section_main__subtitle">
            <span>{hash}</span>
          </h3>
        </div>
      </section>
      {status === 'loading' && <PageLoading />}
      {error && status !== 'loading' && <PageError />}
      {txData && TxDetails(txData)}
      {txData &&
        txData.txReceipt &&
        isContractTx(txData.type) &&
        ContractTxDetails(txData)}
      {rawTxData && RawTxDetails(rawTxData)}
    </Layout>
  )
}

export default Tx

function TxDetails(data) {
  return (
    <section className="section section_details">
      <h3>Details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Block:</div>
              <div className="text_block">
                <Link href="/block/[block]" as={`/block/${data.blockHeight}`}>
                  <a>{data.blockHeight}</a>
                </Link>
              </div>
              <hr />
              <div className="control-label">Epoch:</div>
              <div className="text_block">
                <Link href="/epoch/[epoch]" as={`/epoch/${data.epoch}`}>
                  <a>{epochFmt(data.epoch)}</a>
                </Link>
              </div>

              <hr />
              <div className="control-label">From:</div>

              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                <Link href="/address/[address]" as={`/address/${data.from}`}>
                  <a>
                    <img
                      className="user-pic"
                      src={`https://robohash.idena.io/${data.from.toLowerCase()}`}
                      alt="pic"
                      width="32"
                    />
                    <span>{data.from}</span>
                  </a>
                </Link>
              </div>

              <hr />
              <div className="control-label">Amount:</div>
              <div className="text_block">
                {dnaFmt(
                  (!data.txReceipt || data.txReceipt.success) &&
                    data.amount * 1 +
                      (data.data && typeof data.data.transfer !== 'undefined'
                        ? data.data.transfer * 1
                        : 0)
                )}
              </div>

              <hr />
              <div className="control-label">Size, bytes:</div>
              <div className="text_block">{data.size}</div>
              <hr />
              <div className="control-label">Nonce:</div>
              <div className="text_block">{data.nonce}</div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Created:</div>
              <div className="text_block">{dateTimeFmt(data.timestamp)}</div>
              <hr />
              <div className="control-label">Type:</div>
              <div className="text_block">
                {`${txTypeFmt(data.type, data.data)}`}
              </div>

              <hr />
              <div className="control-label">To:</div>

              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {data.to ? (
                  <Link href="/address/[address]" as={`/address/${data.to}`}>
                    <a>
                      <img
                        className="user-pic"
                        src={`https://robohash.idena.io/${data.to.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                      <span>{data.to}</span>
                    </a>
                  </Link>
                ) : (
                  '-'
                )}
              </div>

              <hr />
              <div className="control-label">Fee paid:</div>
              <div className="text_block">{data.fee}</div>

              <hr />
              <div className="control-label">Fee limit:</div>
              <div className="text_block">{data.maxFee}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContractTxDetails(data) {
  return (
    <section className="section section_details">
      <h3>{`${txTypeFmt(data.type, data.data)}`} details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Contract:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {data.txReceipt.contractAddress ? (
                  <Link
                    href="/contract/[address]"
                    as={`/contract/${data.txReceipt.contractAddress}`}
                  >
                    <a>
                      <img
                        className="user-pic"
                        src={`https://robohash.idena.io/${data.txReceipt.contractAddress.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                      <span>{data.txReceipt.contractAddress}</span>
                    </a>
                  </Link>
                ) : (
                  '-'
                )}
              </div>

              <hr />
              <div className="control-label">Gas used:</div>
              <div className="text_block">{data.txReceipt.gasUsed}</div>

              <hr />
              <div className="control-label">Result:</div>
              <div
                className="text_block"
                style={{
                  color: `${data.txReceipt.success ? 'inherit' : 'red'}`,
                }}
              >
                {data.txReceipt.success ? 'Success' : 'Error'}
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Method:</div>
              <div className="text_block">{data.txReceipt.method || '-'}</div>

              <hr />
              <div className="control-label">Gas cost:</div>
              <div className="text_block">{dnaFmt(data.txReceipt.gasCost)}</div>

              <hr />
              {data.txReceipt.errorMsg && (
                <>
                  <div className="control-label">Error:</div>
                  <div className="text_block">{data.txReceipt.errorMsg}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RawTxDetails(data) {
  return (
    <section className="section section_details">
      <h3>Raw transaction</h3>
      <div className="card">
        <div className="row">
          <div className="text_block" style={{wordBreak: 'break-all'}}>
            {data}
          </div>
        </div>
      </div>
    </section>
  )
}
