import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaUnloadedFlipsChart from '../../../screens/charts/components/dataareaunloadedflips'
import {getUnloadedFlips} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {precise2} from '../../../shared/utils/utils'

function UnloadedFlips() {
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
            nounloaded: precise2(
              item.participants && (item.nounloaded / item.participants) * 100
            ),
            unloaded1: precise2(
              item.participants && (item.unloaded1 / item.participants) * 100
            ),

            unloaded2: precise2(
              item.participants && (item.unloaded2 / item.participants) * 100
            ),

            unloaded3: precise2(
              item.participants &&
                (item.unloaded3plus / item.participants) * 100
            ),
          }))

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Unloaded Flips Chart">
      <ChartHeader
        title="Unloaded flips"
        descr="This chart shows the share of participants who had unloaded flips at validation."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaUnloadedFlipsChart
                chartData={chartData.data}
                valueName="Share of participants with unloaded flips"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default UnloadedFlips
