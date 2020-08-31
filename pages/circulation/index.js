import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import Layout from '../../shared/components/layout'
import Coins from '../../screens/circulation/components/coins'
import Vested from '../../screens/circulation/components/vested'

function Circulation() {
  return (
    <Layout title="Circulating supply (iDNA)">
      <section className="section section_info">
        <div className="row">
          <Coins />
        </div>
      </section>

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink active>
                      <h3>Vested coins</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab="vestedCoins">
            <TabPane tabId="vestedCoins">
              <div className="card">
                <Vested />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>

      <section className="section section_main">
        <div className="row">
          <div className="col-12 col-sm-12">
            <a
              type="button"
              className="btn btn-block btn-secondary"
              href="https://medium.com/idena/idena-community-report-current-state-and-next-steps-dce97a0e3034"
            >
              <i className="icon icon--medium" />
              <span>See Idena community report for details</span>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Circulation
