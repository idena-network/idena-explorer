import {useEffect, useState} from 'react'
import Layout from '../../../shared/components/layout'
import {getCoins} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'
import DataAreaCoinsChart from '../../../screens/charts/components/dataareacoins'

function CirculatingSupply() {
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
            y: precise2(item.totalsupply - item.vested - item.staked),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Circulating Supply Chart">
      <ChartHeader
        title="Circulating Supply"
        descr="This chart shows the total amount of iDNA coins available for trade. Circulating supply is calculated as 'Total Supply' minus 'Vested
            Coins' minus 'Staked Coins'"
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaCoinsChart
                chartData={chartData.data}
                valueName="Circulating Supply"
                xValueName="Date"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CirculatingSupply
