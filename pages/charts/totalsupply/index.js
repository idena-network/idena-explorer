import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaTotalSupplyChart from '../../../screens/charts/components/dataareatotalsupply'
import {getCoins} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function Burnt() {
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
            timestamp: new Date(item.timestamp).getTime(),
            staked: precise2(item.staked),
            vested: precise2(item.vested),
            minted: precise2(item.minted),
            burnt: precise2(item.burnt),
            totalSupply: precise2(item.totalsupply),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Total Supply Structure Chart">
      <ChartHeader
        title="Total Supply"
        descr="This chart shows the total supply structure of iDNA coins."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaTotalSupplyChart
                chartData={chartData.data}
                valueName="iDNA"
                xValueName="Date"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Burnt
