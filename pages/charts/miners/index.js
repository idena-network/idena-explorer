import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getMinersHistory} from '../../../shared/api'

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
      <section className="section section_info">
        <h1>Active miners</h1>
        <div className="card">
          <div className="row">
            <p className="control-label">
              Total number of actively mining identities running their own
              mining nodes or delegated into mining pools.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart chartData={chartData} valueName="Active miners" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Miners
