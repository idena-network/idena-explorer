import {useQuery} from 'react-query'
import Link from 'next/link'
import {NavItem, NavLink, TabContent, TabPane} from 'reactstrap'
import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import {getBlock, getLastBlock} from '../../shared/api'
import {PageLoading, PageError} from '../../shared/components/loading'
import {dateTimeFmt, epochFmt} from '../../shared/utils/utils'
import Transactions from '../../screens/block/components/transactions'
import TooltipText from '../../shared/components/tooltip'
import {BlockFlag} from '../../screens/epoch/components/blocks'

function Block() {
  const router = useRouter()
  const {block} = router.query

  const {data, error, status} = useQuery(block, getBlock)

  const {data: lastBlockData} = useQuery(['last', block], getLastBlock)
  const lastBlock = lastBlockData && lastBlockData.height

  return (
    <Layout title={`Block ${block}`}>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Block {block}</h1>
          <h3 className="section_main__subtitle">
            <span>{(data && data.hash) || '...'}</span>
          </h3>
        </div>

        <div className="button-group">
          <Link href="/block/[block]" as={`/block/${block - 1}`}>
            <a className="btn btn-secondary btn-small" disabled={block === 1}>
              <i className="icon icon--thin_arrow_left" />
              <span>Previous block</span>
            </a>
          </Link>

          <Link href="/block/[block]" as={`/block/${block * 1 + 1}`}>
            <a
              className="btn btn-secondary btn-small"
              disabled={block * 1 >= lastBlock}
            >
              <span>Next block</span>
              <i className="icon icon--thin_arrow_right" />
            </a>
          </Link>
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

export default Block

function BlockDetails(data) {
  const isOfflineCommit = !!(
    data &&
    data.flags &&
    data.flags.find((f) => f === 'OfflineCommit')
  )
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
                        src={`https://robohash.idena.io/${data.proposer.toLowerCase()}`}
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
              <div className="control-label" data-toggle="tooltip">
                <TooltipText tooltip="Mininum threshold for the block proposer selection">
                  Proposer selection threshold:
                </TooltipText>
              </div>
              <div className="text_block">{data.vrfProposerThreshold}</div>

              <hr />
              <div className="control-label" data-toggle="tooltip">
                <TooltipText tooltip="iDNA per byte">Fee rate:</TooltipText>
              </div>
              <div className="text_block">{data.feeRate}</div>

              <hr />
              <div className="control-label" data-toggle="tooltip">
                <TooltipText tooltip="Block flags">Flags:</TooltipText>
              </div>
              <div className="text_block">
                {(data && (data.flags || data.upgrade > 0) && (
                  <div
                    style={{
                      marginTop: '4px',
                    }}
                  >
                    {data.flags &&
                      data.flags.map((flag) => (
                        <span
                          key={flag}
                          style={{
                            marginRight: '4px',
                          }}
                        >
                          <BlockFlag flag={flag} />
                        </span>
                      ))}
                    {data.upgrade > 0 && (
                      <span
                        key="upgrade"
                        style={{
                          marginRight: '4px',
                        }}
                      >
                        <BlockFlag flag="HardForkUpdate" />
                      </span>
                    )}
                  </div>
                )) ||
                  '-'}
              </div>

              {data.offlineAddress && (
                <>
                  <hr />
                  <div className="control-label" data-toggle="tooltip">
                    <TooltipText
                      tooltip={
                        isOfflineCommit
                          ? 'Offline address that was penalized'
                          : 'Address that proposed for offline penalty'
                      }
                    >
                      {isOfflineCommit ? 'Offline penalty' : 'Offline poposal'}:
                    </TooltipText>
                  </div>
                  <div
                    className="text_block text_block--ellipsis"
                    style={{width: '70%'}}
                  >
                    <Link
                      href="/identity/[address]"
                      as={`/identity/${data.offlineAddress}`}
                    >
                      <a>
                        <img
                          className="user-pic"
                          src={`https://robohash.idena.io/${data.offlineAddress.toLowerCase()}`}
                          alt="pic"
                          width="32"
                        />
                        <span>{data.offlineAddress}</span>
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
