import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useQuery} from 'react-query'
import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import {getPool} from '../../shared/api'
import Delegators from '../../screens/pool/components/delegators'
import {useHash, useHashChange} from '../../shared/utils/useHashChange'
import Rewards from '../../screens/pool/components/rewards'

const DEFAULT_TAB = '#delegators'

function Contract() {
  const router = useRouter()
  const address = router.query.address || ''

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: poolInfo} = useQuery(
    address && ['pool', address],
    (_, address) => getPool(address)
  )

  return (
    <Layout title={`Pool ${address}`}>
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
                <span>Pool</span>
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
            </div>
          </div>
        </div>
      </section>

      <PoolData poolInfo={poolInfo} />

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
                      <h3>Pool's delegators</h3>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#rewards'}
                      href="#rewards"
                    >
                      <h3>Rewards</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                {poolInfo && (
                  <Delegators
                    address={address}
                    visible={hashReady && (hash === DEFAULT_TAB || !hash)}
                  />
                )}
              </div>
            </TabPane>
            <TabPane tabId="#rewards">
              <div className="card">
                {poolInfo && (
                  <Rewards
                    address={address}
                    visible={hashReady && hash === '#rewards'}
                  />
                )}
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function PoolData({poolInfo}) {
  return (
    <>
      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-4">
              <div className="section__group">
                <div className="control-label">Size:</div>
                <div className="text_block">
                  {(poolInfo && poolInfo.size) || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contract
