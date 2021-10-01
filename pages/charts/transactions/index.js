import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaChart from '../../../screens/charts/components/dataarea'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getTransactionsDaily} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Transactions() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getTransactionsDaily()
      const data =
        result &&
        result.data &&
        result.data.map((item) => ({
          y:
            item.send_trans +
            item.invite_trans +
            item.flip_trans +
            item.valid_trans +
            item.contract_trans +
            item.deleg_trans +
            item.mining_trans +
            item.other_trans,
          x: dateTimeFmt(item.date),
        }))
      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Daily Transactions Chart">
      <ChartHeader
        title="Transactions"
        descr="This chart shows the total number of transactions by days."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaChart
                chartData={chartData.data}
                valueName="Transactions"
                xValueName="Timestamp"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Transactions
