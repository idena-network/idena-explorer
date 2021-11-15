import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import {getIdentitiesByStatus} from '../../../shared/api'
import DataBarIdentitiesChart from '../../../screens/charts/components/databaridentities'
import ChartHeader from '../../../screens/charts/components/chartheader'

function IdentitiesByStatus() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getIdentitiesByStatus()
      const data =
        result &&
        result.data &&
        result.data.map((item) => {
          const total =
            item.newbie +
            item.verified +
            item.human +
            item.suspended +
            item.zombie

          const newbieRate = total && (item.newbie / total) * 100
          const verifiedRate = total && (item.verified / total) * 100
          const humanRate = total && (item.human / total) * 100
          const suspendedRate = total && (item.suspended / total) * 100
          const zombieRate = total && (item.zombie / total) * 100

          return {
            epoch: item.epoch,
            newbie: item.newbie,
            verified: item.verified,
            human: item.human,
            suspended: item.suspended,
            zombie: item.zombie,
            rates: [
              newbieRate,
              verifiedRate,
              humanRate,
              suspendedRate,
              zombieRate,
            ],
          }
        })

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Identities by status chart">
      <ChartHeader
        title="Identities By Status"
        descr="This chart shows the breakdown of identities by their statuses by epochs."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataBarIdentitiesChart
                chartData={chartData.data}
                valueName="Idenities"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IdentitiesByStatus
