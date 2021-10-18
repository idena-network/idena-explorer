import {useEffect, useState} from 'react'
import Layout from '../../../shared/components/layout'
import {getCoins} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'
import DataAreaCoinsChart from '../../../screens/charts/components/dataareacoins'

function Staked() {
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
            y: precise2(item.staked),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Staked Coins Chart">
      <ChartHeader
        title="Staked coins"
        descr="This chart shows the total amount of iDNA coins locked in identities' stakes"
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaCoinsChart
                chartData={chartData.data}
                valueName="Total staked"
                xValueName="Date"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Staked
