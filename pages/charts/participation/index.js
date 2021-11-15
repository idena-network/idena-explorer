import {useEffect, useState} from 'react'

import Layout from '../../../shared/components/layout'
import DataAreaParticipationChart from '../../../screens/charts/components/dataareaparticipation'
import {getPotentialParticipants} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'

function Participation() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getPotentialParticipants()
      const data =
        result &&
        result.data &&
        result.data.map((item) => {
          const totalT =
            item.candidate_t +
            item.newbie_t +
            item.verified_t +
            item.human_t +
            item.suspended_t +
            item.zombie_t

          const totalP =
            item.candidate_p +
            item.newbie_p +
            item.verified_p +
            item.human_p +
            item.suspended_p +
            item.zombie_p

          const totalV =
            item.candidate_v +
            item.newbie_v +
            item.verified_v +
            item.human_v +
            item.suspended_v +
            item.zombie_v

          return {
            epoch: item.epoch,
            validated: totalT && (totalV / totalT) * 100,
            failed: totalT && ((totalP - totalV) / totalT) * 100,
            missed: totalT && (1 - totalP / totalT) * 100,
            abs: [totalV, totalP - totalV, totalT - totalP],
          }
        })

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Participation Chart">
      <ChartHeader
        title="Participation"
        descr="This chart shows the breakdown of all potential participants (candidates, newbies, verified, humans, suspended, zombies) whether they successfully validated, failed validation or missed validation."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataAreaParticipationChart
                chartData={chartData.data}
                valueName="Share of all potential participants"
                xValueName="Epoch"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Participation
