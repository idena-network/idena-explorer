import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataBar from '../../../screens/charts/components/databar'
import {getNewcomers} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Newcomers() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getNewcomers()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          y: item.cnt,
          x: item.epoch,
        }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Newcomers Chart">
      <ChartHeader
        title="Newcomers"
        descr="The chart shows the number of identities that validated for the
        first time."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataBar
                chartData={chartData.data}
                valueName="Newcomers"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Newcomers
