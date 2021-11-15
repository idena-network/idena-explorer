import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaFailsChart from '../../../screens/charts/components/dataareafails'
import {getValidationFails} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function Fails() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getValidationFails()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          epoch: item.epoch,
          success: precise2(item.total && (item.success / item.total) * 100),
          late: precise2(item.total && (item.late / item.total) * 100),
          wrong: precise2(item.total && (item.wrong / item.total) * 100),
          missing: precise2(item.total && (item.missing / item.total) * 100),
          lowscore: precise2(item.total && (item.lowscore / item.total) * 100),
          abs: [item.lowscore, item.late, item.wrong, item.missing],
        }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Failure Ratio Chart">
      <ChartHeader
        title="Validation Failure Ratio"
        descr="This chart shows the failure ratio of validation participants broken down by the reason of failure. It is calculated as the number of failed identities divided by the total number of participants who attended validation."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaFailsChart
                chartData={chartData.data}
                valueName="Failure Ratio"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Fails
