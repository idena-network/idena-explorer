import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataBarFlips from '../../../screens/charts/components/databarflips'
import {getReportedFlips} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function ReportedFlips() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getReportedFlips()
      const data =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch > 20)
          .map((item) => ({
            y: item.num_of_reports,
            x: item.epoch,
            z:
              item.total_num &&
              precise2((item.num_of_reports / item.total_num) * 100),
            t: item.total_num,
          }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Reported Flips Chart">
      <ChartHeader
        title="Reported Flips"
        descr="The chart shows the number of reported flips by epochs. 
        A flip is considered as Reported if it was disqualified by a majority vote of the qualification committee during the validation ceremony."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataBarFlips
                chartData={chartData.data}
                valueName="Reported Flips"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ReportedFlips
