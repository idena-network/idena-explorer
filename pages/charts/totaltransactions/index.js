import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateFmt, precise2} from '../../../shared/utils/utils'
import {getTransactionsDaily} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function TotalTransactions() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getTransactionsDaily()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          y: precise2(item.cum_trans),
          x: dateFmt(item.date),
        }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Total Transactions Chart">
      <ChartHeader
        title="Total Transactions"
        descr="This chart shows the total number of transactions"
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData.data}
                valueName="Total transactions"
                xValueName="Date"
                yAxisUnit="M"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default TotalTransactions
