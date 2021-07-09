import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getPeersHistory} from '../../../shared/api'

function Miners() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getPeersHistory()
      const data =
        result &&
        result.map((item) => ({
          y: item.count,
          x: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [])

  return (
    <Layout title="Full Nodes Chart">
      <section className="section section_info">
        <h1>Full Nodes</h1>
        <div className="card">
          <div className="row">
            <p className="control-label">
              Total number of full nodes discovered in the network within 1
              hour. These nodes are run by validated identities, candidates,
              non-validated users (wallets), shared node owners, exchanges, etc.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart chartData={chartData} valueName="Full nodes" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Miners
