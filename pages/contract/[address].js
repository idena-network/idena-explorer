import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import {getAddressInfo, getContract} from '../../shared/api'
import {
  contractVerificationFmt,
  dnaFmt,
  precise6,
  tokenNameFmt,
} from '../../shared/utils/utils'
import Transfers from '../../screens/contract/components/transfers'
import VotingData from '../../screens/contract/components/voting'
import TimeLockData from '../../screens/contract/components/timelock'
import OracleLockData from '../../screens/contract/components/oraclelock'
import MultisigData from '../../screens/contract/components/multisig'
import RefundableOracleLockData from '../../screens/contract/components/refundableoraclelock'
import WasmData from '../../screens/contract/components/wasm'
import {ContractVerificationState} from '../../shared/utils/types'
import {useHash, useHashChange} from '../../shared/utils/useHashChange'
import SourceCode from '../../screens/contract/components/sourceCode'

const DEFAULT_TAB = '#transfers'

function Contract() {
  const router = useRouter()
  const address = router.query.address || ''

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: addressInfo} = useQuery(
    address && ['balance', address],
    (_, address) => getAddressInfo(address)
  )

  const {data: contractInfo} = useQuery(
    address && ['contract', address],
    (_, address) => getContract(address)
  )

  const [verification, setVerification] = useState(null)

  useEffect(() => {
    if (contractInfo) {
      setVerification(contractInfo.verification)
    }
  }, [contractInfo])

  const isVoting = contractInfo && contractInfo.type === 'OracleVoting'
  const isTimeLock = contractInfo && contractInfo.type === 'TimeLock'
  const isOracleLock = contractInfo && contractInfo.type === 'OracleLock'
  const isRefundableOracleLock =
    contractInfo && contractInfo.type === 'RefundableOracleLock'
  const isMultisig = contractInfo && contractInfo.type === 'Multisig'
  const isWasm = contractInfo && contractInfo.type === 'Contract'

  return (
    <Layout title={`Smart contract ${address}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.org/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">
                <span>Smart contract</span>
              </h1>
              <h3 className="section_main__subtitle">{address}</h3>
            </div>

            <div className="button-group">
              <Link href="/address/[address]" as={`/address/${address}`}>
                <a className="btn btn-small btn-secondary">
                  <i className="icon icon--coins" />
                  <span>Address details</span>
                </a>
              </Link>

              {isVoting && (
                <a
                  href={`https://app.idena.io/dna/vote?address=${address}`}
                  target="_blank"
                  className="btn btn-small btn-secondary"
                >
                  <i className="icon" />
                  <span>Vote</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContractData
        addressInfo={addressInfo}
        contractInfo={contractInfo}
        verification={verification}
      />
      {isVoting && <VotingData address={address} />}
      {isTimeLock && <TimeLockData address={address} />}
      {isOracleLock && <OracleLockData address={address} />}
      {isRefundableOracleLock && <RefundableOracleLockData address={address} />}
      {isMultisig && <MultisigData address={address} />}

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink
                      active={
                        hashReady && (hash === DEFAULT_TAB || hash === '')
                      }
                      href={DEFAULT_TAB}
                    >
                      <h3>Smart contract's transfers</h3>
                    </NavLink>
                  </NavItem>
                  {isWasm && (
                    <>
                      <NavItem>
                        <NavLink
                          active={hashReady && hash === '#code'}
                          href="#code"
                        >
                          <h3>Source code</h3>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={hashReady && hash === '#wasm'}
                          href="#wasm"
                        >
                          <h3>Wasm details</h3>
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId="#transfers">
              <div className="card">
                {contractInfo && (
                  <Transfers
                    address={address}
                    visible={hashReady && (hash === DEFAULT_TAB || !hash)}
                  />
                )}
              </div>
            </TabPane>
            {isWasm && (
              <>
                <TabPane tabId="#code">
                  <div className="card verification-card">
                    <SourceCode
                      address={address}
                      verification={verification}
                      setVerification={setVerification}
                      visible={hashReady && hash === '#code'}
                    />
                  </div>
                </TabPane>
                <TabPane tabId="#wasm">
                  <div className="card">
                    <WasmData
                      contractInfo={contractInfo}
                      visible={hashReady && hash === '#wasm'}
                    />
                  </div>
                </TabPane>
              </>
            )}
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function ContractData({addressInfo, contractInfo, verification}) {
  const isWasm = contractInfo && contractInfo.type === 'Contract'
  const token = isWasm && contractInfo.token
  const isEmbedded = contractInfo && contractInfo.type !== 'Contract'
  return (
    <>
      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-sm">
              <div className="section__group">
                <div className="control-label">Author:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: '80%'}}
                >
                  {contractInfo ? (
                    <Link
                      href="/address/[address]"
                      as={`/address/${contractInfo.author}`}
                    >
                      <a>
                        <img
                          alt="user-pic"
                          className="user-pic"
                          width="32"
                          src={`https://robohash.idena.io/${contractInfo.author.toLowerCase()}`}
                        />
                        <span>{contractInfo.author}</span>
                      </a>
                    </Link>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
            {isEmbedded && (
              <div className="col-sm">
                <div className="section__group">
                  <div className="control-label">Type:</div>
                  <div className="text_block">
                    {(contractInfo && contractInfo.type) || '-'}
                  </div>
                </div>
              </div>
            )}

            <div className="col-sm">
              <div className="section__group">
                <div className="control-label">Balance:</div>
                <div className="text_block">
                  {(addressInfo && dnaFmt(precise6(addressInfo.balance))) ||
                    '-'}
                </div>
              </div>
            </div>
            {isWasm && (
              <div style={{textAlign: 'right'}} className="col-sm">
                <div className="section__group" style={{paddingBottom: 0}}>
                  <div className="control-label">
                    <VerificationBadge verification={verification} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {token && (
        <section className="section section_details">
          <h3>Token</h3>
          <div className="card">
            <div className="row">
              <div className="col-sm">
                <div className="section__group">
                  <div className="control-label">Address:</div>
                  <div
                    className="text_block text_block--ellipsis"
                    style={{width: '80%'}}
                  >
                    <Link
                      href="/token/[address]"
                      as={`/token/${token.contractAddress}`}
                    >
                      <a>
                        <img
                          alt="user-pic"
                          className="user-pic"
                          width="32"
                          src={`https://robohash.idena.io/${token.contractAddress.toLowerCase()}`}
                        />
                        <span>{token.contractAddress}</span>
                      </a>
                    </Link>
                  </div>
                  <hr />
                  <div className="control-label">Name:</div>
                  <div className="text_block">{token.name || '-'}</div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="section__group">
                  <div className="control-label">Decimals:</div>
                  <div className="text_block">{token.decimals || 0}</div>
                  <hr />
                  <div className="control-label">Symbol:</div>
                  <div className="text_block">{token.symbol || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function VerificationBadge({verification}) {
  const verificationState =
    (verification && verification.state) ||
    ContractVerificationState.NotVerified
  const colors = (() => {
    switch (verificationState) {
      case ContractVerificationState.NotVerified:
        return {
          background: 'rgba(150, 153, 158, 0.08)',
        }
      case ContractVerificationState.Pending:
        return {
          background: 'rgba(255, 163, 102, 0.08)',
          color: '#FFA366',
        }
      case ContractVerificationState.Verified:
        return {
          background: 'rgba(39, 217, 128, 0.08)',
          color: '#27D980',
        }
      case ContractVerificationState.Failed:
        return {
          background: 'rgba(255, 102, 102, 0.08)',
          color: '#FF6666',
        }
      default:
    }
  })()
  return (
    <span
      style={{
        padding: '9px 16px',
        borderRadius: '6px',
        ...colors,
      }}
    >
      {contractVerificationFmt(verificationState)}
    </span>
  )
}

export default Contract
