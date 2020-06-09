import {useQuery} from 'react-query'
import Link from 'next/link'
import Layout from '../../shared/components/layout'
import {getTransaction} from '../../shared/api'
import {PageLoading, PageError} from '../../shared/components/loading'
import {dnaFmt, dateTimeFmt, epochFmt} from '../../shared/utils/utils'

function Tx({hash}) {
  const {data: txData, error, status} = useQuery(hash, getTransaction)
  const {data: rawTxData} = useQuery(`${hash}/raw`, getTransaction)

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
      {rawTxData && RawTxDetails(rawTxData)}
    </Layout>
  )
}

Tx.getInitialProps = function ({query}) {
  return {hash: query.hash}
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
                      src={`https://robohash.org/${data.from.toLowerCase()}`}
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
                  !data.amount && typeof data.transfer !== 'undefined'
                    ? data.transfer
                    : data.amount
                )}
              </div>

              <hr />
              <div className="control-label">Size, bytes:</div>
              <div className="text_block">{data.size}</div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Created:</div>
              <div className="text_block">{dateTimeFmt(data.timestamp)}</div>
              <hr />
              <div className="control-label">Type:</div>
              <div className="text_block">{data.type}</div>

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
                        src={`https://robohash.org/${data.to.toLowerCase()}`}
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
