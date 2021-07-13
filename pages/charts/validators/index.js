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
          y: item.onlineValidators,
          x: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [])

  return (
    <Layout title="Full Mining Nodes Chart">
      <section className="section section_info">
        <h1>Full Mining Nodes</h1>
        <div className="card">
          <div className="row">
            <p className="control-label">
              Total number of full mining nodes run by individual identities or
              pool owners who activated online status.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData}
                valueName="Full mining nodes"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Miners
