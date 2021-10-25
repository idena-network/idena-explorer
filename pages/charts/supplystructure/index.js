import {useEffect, useState} from 'react'
import Layout from '../../../shared/components/layout'
import {getCoins} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'
import DataPieCoinsChart from '../../../screens/charts/components/datapiecoins'

function SupplyComponents() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getCoins()
      const data =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch === 76)
          .map((item) => ({
            x: item.staked,
            y: item.vested,
            z: precise2(item.totalsupply - item.vested - item.staked),
            s: item.totalsupply,
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  const data = [
    {name: 'Circulating supply', value: 52342406},
    {name: 'Vested coins', value: 20819938},
    {name: 'Staked coins', value: 2369634},
  ]

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
              <DataPieCoinsChart
                chartData={data}
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

export default SupplyComponents
