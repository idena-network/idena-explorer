import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaNonloadedFlipsChart from '../../../screens/charts/components/dataareanonloadedflips'
import {getUnloadedFlips} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function NonloadedFlips() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getUnloadedFlips()
      const data =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch > 62)
          .map((item) => ({
            epoch: item.epoch,
            nonloaded: precise2(
              item.participants && (item.unloaded / item.participants) * 100
            ),
            nonloaded1: precise2(
              item.participants && (item.unloaded1 / item.participants) * 100
            ),

            nonloaded2: precise2(
              item.participants && (item.unloaded2 / item.participants) * 100
            ),

            nonloaded3: precise2(
              item.participants &&
                (item.unloaded3plus / item.participants) * 100
            ),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Non-loaded Flips Chart">
      <ChartHeader
        title="Non-loaded flips"
        descr="This chart shows the share of participants who had issues with non-loaded flips at validation."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaNonloadedFlipsChart
                chartData={chartData.data}
                valueName="Share of participants"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default NonloadedFlips
