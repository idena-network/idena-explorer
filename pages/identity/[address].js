import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useQuery} from 'react-query'
import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import {
  getIdentityAge,
  getOnlineStatus,
  getIdentity,
  getAddressInfo,
} from '../../shared/api'
import {
  dnaFmt,
  identityStatusFmt,
  dateTimeFmt,
  precise6,
  humanizeDuration,
} from '../../shared/utils/utils'
import FlipsStatus from '../../screens/identity/components/flipsStatus'
import ValidationStatus from '../../screens/identity/components/validationStatus'
import Epochs from '../../screens/identity/components/epochs'
import Flips from '../../screens/identity/components/flips'
import Invites from '../../screens/identity/components/invites'
import {useHashChange, useHash} from '../../shared/utils/useHashChange'
import TooltipText from '../../shared/components/tooltip'
import Pools from '../../screens/identity/components/pools'

const DEFAULT_TAB = '#validations'

function Identity() {
  const router = useRouter()
  const address = router.query.address || ''

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: addressInfo} = useQuery(
    address && ['balance', address],
    (_, address) => getAddressInfo(address)
  )

  const {data: identityInfo} = useQuery(
    address && ['identity', address],
    (_, address) => getIdentity(address)
  )

  const {data: onlineStatus} = useQuery(
    address && ['online', address],
    (_, address) => getOnlineStatus(address)
  )

  const {data: identityAge} = useQuery(
    address && ['age', address],
    (_, address) => getIdentityAge(address)
  )

  return (
    <Layout title={`Identity ${address}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.idena.io/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
              <div className="verified_sign">
                {identityInfo && identityInfo.state === 'Human' && (
                  <i className="icon icon--status" />
                )}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">{address}</h1>
            </div>

            <Link href="/address/[address]" as={`/address/${address}`}>
              <a className="btn btn-small btn-primary">
                <i className="icon icon--coins" />
                <span>Address details</span>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <IdentityData
        addressInfo={addressInfo}
        identityInfo={identityInfo}
        onlineStatus={onlineStatus}
        identityAge={identityAge}
      />

      <section className="section section_info">
        <div className="row">
          <ValidationStatus identityInfo={identityInfo} />
          <FlipsStatus address={address} />
        </div>
      </section>

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
                      href="#validations"
                    >
                      <h3>Identity's validations</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#flips'}
                      href="#flips"
                    >
                      <h3>Created flips</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#invites'}
                      href="#invites"
                    >
                      <h3>Invites</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#pools'}
                      href="#pools"
                    >
                      <h3>Identity's pools</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <Epochs
                  address={address}
                  visible={hashReady && (hash === DEFAULT_TAB || hash === '')}
                />
              </div>
            </TabPane>
            <TabPane tabId="#flips">
              <div className="card">
                <Flips
                  address={address}
                  visible={hashReady && hash === '#flips'}
                />
              </div>
            </TabPane>
            <TabPane tabId="#invites">
              <div className="card">
                <Invites
                  address={address}
                  visible={hashReady && hash === '#invites'}
                />
              </div>
            </TabPane>
            <TabPane tabId="#pools">
              <div className="card">
                <Pools
                  address={address}
                  visible={hashReady && hash === '#pools'}
                />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function IdentityData({addressInfo, identityInfo, onlineStatus, identityAge}) {
  const onlineMiner =
    identityInfo &&
    (identityInfo.state === 'Newbie' ||
      identityInfo.state === 'Verified' ||
      identityInfo.state === 'Human')

  return (
    <>
      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Status:</div>
                <div className="text_block">
                  {(identityInfo && identityStatusFmt(identityInfo.state)) ||
                    '-'}
                </div>

                <div className={`onlineMiner ${onlineMiner ? '' : 'hidden'}`}>
                  <hr />
                  <div className="control-label">Online miner status:</div>
                  {onlineStatus && onlineStatus.delegatee && (
                    <>
                      <div className="text_block">
                        <span>Delegated to</span>
                      </div>
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: '50%'}}
                      >
                        <Link
                          href="/pool/[address]"
                          as={`/pool/${onlineStatus.delegatee.address}`}
                        >
                          <a>
                            <img
                              alt="user-pic"
                              className="user-pic"
                              width="32"
                              src={`https://robohash.idena.io/${onlineStatus.delegatee.address.toLowerCase()}`}
                            />
                            <span>{onlineStatus.delegatee.address}</span>
                          </a>
                        </Link>
                      </div>
                    </>
                  )}
                  {!onlineStatus ||
                    (!onlineStatus.delegatee && (
                      <>
                        <div className="text_block">
                          {onlineStatus && onlineStatus.online ? 'On' : 'Off'}
                        </div>
                      </>
                    ))}
                  <hr />
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="The time of the latest block issued / vote for a block issue"
                  >
                    Last seen:
                  </TooltipText>
                  <div className="text_block">
                    {(onlineStatus &&
                      onlineStatus.lastActivity &&
                      dateTimeFmt(onlineStatus.lastActivity)) ||
                      '-'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Age:</div>
                <div className="text_block">{identityAge}</div>

                <div className={`onlineMiner ${onlineMiner ? '' : 'hidden'}`}>
                  <hr />
                  <div className="control-label">Stake:</div>
                  <div className="text_block">
                    {(addressInfo && dnaFmt(precise6(addressInfo.stake))) ||
                      '-'}
                  </div>

                  <hr />
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Mining penalty left"
                  >
                    Mining penalty:
                  </TooltipText>
                  <div className="text_block">
                    {(onlineStatus &&
                      ((onlineStatus.penalty * 1 &&
                        dnaFmt(precise6(onlineStatus.penalty))) ||
                        (onlineStatus.penaltySeconds &&
                          humanizeDuration(onlineStatus.penaltySeconds)))) ||
                      '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Identity
