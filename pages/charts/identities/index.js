import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import {getIdentitiesByStatus} from '../../../shared/api'
import DataBarChart from '../../../screens/charts/components/databar'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Identities() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getIdentitiesByStatus()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          x: item.epoch,
          y: item.newbie + item.verified + item.human,
        }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Validated Identities Chart">
      <ChartHeader
        title="Validated Identities"
        descr="Total number of validated identities with status Newbie, Verified
        or Human by epochs."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataBarChart
                chartData={chartData.data}
                valueName="Total identities"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Identities
