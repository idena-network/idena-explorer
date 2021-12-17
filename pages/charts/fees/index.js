import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateFmt, precise2} from '../../../shared/utils/utils'
import {getTransactionsDaily} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Fees() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getTransactionsDaily()
      const data =
        result &&
        result.data &&
        result.data
          .filter((item) => item.date > '2020-05-14T00:00:00Z')
          .map((item) => ({
            y: precise2(item.cum_fee),
            x: dateFmt(item.date),
          }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Total Fees Chart">
      <ChartHeader
        title="Total Fees"
        descr="This chart shows the total amount of paid fee"
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData.data}
                valueName="Total fees, iDNA"
                xValueName="Date"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Fees
