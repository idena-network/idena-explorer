import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import {getIdentitiesByStatus} from '../../../shared/api'
import DataBarIdentitiesChart from '../../../screens/charts/components/databaridentities'
import ChartHeader from '../../../screens/charts/components/chartheader'

function IdentitiesByStatus() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getIdentitiesByStatus()
      setChartData(result)
    }
    getData()
  }, [])

  return (
    <Layout title="Identities by status chart">
      <ChartHeader
        title="Identities By Status"
        descr="This chart shows the breakdown of identities by their statuses by epochs."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataBarIdentitiesChart
                chartData={chartData.data}
                valueName="Idenities"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IdentitiesByStatus
