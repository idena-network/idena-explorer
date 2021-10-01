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
          y: item.onlineValidators,
          x: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [])

  return (
    <Layout title="Mining Nodes Chart">
      <ChartHeader
        title="Mining Nodes"
        descr="Total number of mining nodes run by individual identities or pool
        owners who activated online status."
      />
      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData}
                valueName="Mining nodes"
                xValueName="Datestamp"
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
