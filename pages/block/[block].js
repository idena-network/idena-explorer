import {useQuery} from 'react-query'
import Link from 'next/link'
import {NavItem, NavLink, TabContent, TabPane} from 'reactstrap'
import Layout from '../../shared/components/layout'
import {getBlock} from '../../shared/api'
import {PageLoading, PageError} from '../../shared/components/loading'
import {dateTimeFmt, epochFmt} from '../../shared/utils/utils'
import Transactions from './components/transactions'
import TooltipText from '../../shared/components/tooltip'

function Block({block}) {
  const {data, error, status} = useQuery(block, getBlock)

  return (
    <Layout>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Block</h1>
          <h3 className="section_main__subtitle">
            <span>{(data && data.hash) || '...'}</span>
          </h3>
        </div>
      </section>
      {status === 'loading' && <PageLoading />}
      {error && status !== 'loading' && <PageError />}
      {data && BlockDetails(data)}

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink active>
                      <h3>Transactions</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab="transactions">
            <TabPane tabId="transactions">
              <div className="card">
                {block && <Transactions block={block} />}
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

Block.getInitialProps = function ({query}) {
  return {block: query.block}
}

export default Block

function BlockDetails(data) {
  return (
    <section className="section section_details">
      <h3>Details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Height:</div>
              <div className="text_block">{data.height}</div>
              <hr />

              <div className="control-label">Epoch:</div>
              <div className="text_block">
                <Link href="/epoch/[epoch]" as={`/epoch/${data.epoch}#blocks`}>
                  <a>{epochFmt(data.epoch)}</a>
                </Link>
              </div>
              <hr />

              <div className="control-label">Issuer:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {data.proposer ? (
                  <Link
                    href="/identity/[address]"
                    as={`/identity/${data.proposer}`}
                  >
                    <a>
                      <img
                        className="user-pic"
                        src={`https://robohash.org/${data.proposer.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                      <span>{data.proposer}</span>
                    </a>
                  </Link>
                ) : (
                  '-'
                )}
              </div>

              <hr />
              <div className="control-label">Transactions:</div>
              <div className="text_block">{data.txCount}</div>

              <hr />
              <div className="control-label">Block size, bytes:</div>
              <div className="text_block">{data.fullSize}</div>

              <hr />
              <div className="control-label">Transactions size, bytes:</div>
              <div className="text_block">{data.bodySize}</div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Created:</div>
              <div className="text_block">{dateTimeFmt(data.timestamp)}</div>
              <hr />
              <div className="control-label" data-toggle="tooltip">
                <TooltipText tooltip="Committee size validating the block">
                  Validators:
                </TooltipText>
              </div>
              <div className="text_block">{data.validatorsCount}</div>

              <hr />
              <div className="control-label" data-toggle="tooltip">
                <TooltipText tooltip="Verifiable random score of the issuer">
                  Issuer score:
                </TooltipText>
              </div>
              <div className="text_block">{data.proposerVrfScore || '-'}</div>

              <hr />
              <div className="control-label">
                <TooltipText tooltip="Mininum threshold for the block proposer selection">
                  Proposer selection threshold:
                </TooltipText>
              </div>
              <div className="text_block">{data.vrfProposerThreshold}</div>

              <hr />
              <div className="control-label">
                <TooltipText tooltip="DNA per byte">Fee rate:</TooltipText>
              </div>
              <div className="text_block">{data.feeRate}</div>

              <hr />
              <div className="control-label" />
              <div className="text_block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
