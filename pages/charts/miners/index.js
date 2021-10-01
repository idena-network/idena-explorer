import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getMinersHistory} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Miners() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getMinersHistory()
      const data =
        result &&
        result.map((item) => ({
          y: item.onlineMiners,
          x: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [])

  return (
    <Layout title="Active Miners Chart">
      <ChartHeader
        title="Active miners"
        descr="Total number of actively mining identities running their own
        mining nodes or delegated into mining pools."
      />
      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData}
                valueName="Active miners"
                xValueName="Timestamp"
                xReversed
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Miners
