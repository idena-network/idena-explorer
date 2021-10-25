import {useEffect, useState} from 'react'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import Layout from '../../../shared/components/layout'
import {getCoins} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'
import DataAreaCoinsChart from '../../../screens/charts/components/dataareacoins'
import Vested from '../../../screens/charts/vested/components/vested.js'

function VestedChart() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getCoins()
      const data =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch > 7)
          .map((item) => ({
            x: new Date(item.timestamp).getTime(),
            y: precise2(item.vested),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Vested Coins Chart">
      <ChartHeader
        title="Vested coins"
        descr="This chart shows the total amount of iDNA coins that are vested, including premined coins of Idena core team, early investors, foundation wallet and zero wallet."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaCoinsChart
                chartData={chartData.data}
                valueName="Total vested"
                xValueName="Date"
              />
            </div>
          </div>
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

      <h3>See also</h3>
      <div className="control-label">
        <p className="section_main__subtitle">
          See{' '}
          <a
            href="https://medium.com/idena/idena-community-report-current-state-and-next-steps-dce97a0e3034"
            target="_blank"
            rel="noreferrer"
          >
            Idena community report 2020
          </a>{' '}
          for details
        </p>
      </div>
    </Layout>
  )
}

export default VestedChart
