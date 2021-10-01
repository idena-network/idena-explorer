import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {getSuccessRatio} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function SuccessRatio() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getSuccessRatio()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          x: item.epoch,
          y: precise2(item.success * 100),
        }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Validation Success Ratio Chart">
      <ChartHeader
        title="Validation Success Ratio"
        descr="Validation success ratio is calculated as the total number of
        validated identities divided by the total number of users
        participated in validation."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData.data}
                valueName="Success Ratio, %"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default SuccessRatio
