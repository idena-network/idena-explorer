import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useQuery} from 'react-query'
import Supply from '../screens/index/components/supply'
import Identities from '../screens/index/components/identities'
import Layout from '../shared/components/layout'
import EpochsTable from '../screens/index/components/epochs'
import TopAddress from '../screens/index/components/topaddress'
import Miners from '../screens/index/components/miners'
import {getLastEpoch} from '../shared/api'
import {useHash, useHashChange} from '../shared/utils/useHashChange'

const DEFAULT_TAB = '#epochs'

function Home() {
  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data} = useQuery('last-epoch', getLastEpoch)

  return (
    <Layout>
      <section className="section section_info">
        <div className="row">
          <Supply />
          <Identities />
        </div>
      </section>

      <section className="section ">
        <div className="button-group">
          <Link href="/circulation">
            <a className="btn btn-secondary btn-small">
              <i className="icon icon--coins" />
              <span>Circulating supply</span>
            </a>
          </Link>

          <Link
            href="/epoch/[epoch]/validation"
            as={`/epoch/${data && data.epoch}/validation`}
          >
            <a className="btn btn-secondary btn-small">
              <i className="icon icon--report" />
              <span>Validation results</span>
            </a>
          </Link>

          <a
            className="btn btn-secondary btn-small"
            href="https://idena.today"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon icon--timer" />
            <span>More stats</span>
          </a>
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
                      href={DEFAULT_TAB}
                    >
                      <h3>Epochs</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#topaddress'}
                      href="#topaddress"
                    >
                      <h3>Top addresses</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#miners'}
                      href="#miners"
                    >
                      <h3>Online miners</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <EpochsTable
                  visible={hashReady && (hash === DEFAULT_TAB || hash === '')}
                />
              </div>
            </TabPane>
            <TabPane tabId="#topaddress">
              <div className="card">
                <TopAddress visible={hashReady && hash === '#topaddress'} />
              </div>
            </TabPane>
            <TabPane tabId="#miners">
              <div className="card">
                <Miners visible={hashReady && hash === '#miners'} />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

export default Home
