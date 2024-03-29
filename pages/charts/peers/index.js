import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getPeersHistory} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

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
      <ChartHeader
        title="Full Nodes"
        descr="Total number of full nodes discovered in the network within 1
        hour. These nodes are run by both validated identities and non-validated users: candidates,
        shared node owners, wallets, exchanges, etc."
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData}
                valueName="Full nodes"
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
