import {useEffect, useState} from 'react'
import Layout from '../../../shared/components/layout'
import {getInviteActivations, getLastEpoch} from '../../../shared/api'
import ChartHeader from '../../../screens/charts/components/chartheader'
import {dateTimeFmt, precise2} from '../../../shared/utils/utils'
import DataInviteProgressScatterChart from '../../../screens/charts/components/datascatterinvites'

function InviteActivations() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const {epoch} = await getLastEpoch()
      const result = await getInviteActivations()
      const currEpochInvitesData =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch === epoch)
          .map((item) => ({
            x: precise2(item.share_of_period * 100),
            y: precise2(item.cum_activations),
            date: dateTimeFmt(item.timestamp),
            epoch: item.epoch,
          }))

      const prev1EpochInvitesData =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch === epoch - 1)
          .map((item) => ({
            x: precise2(item.share_of_period * 100),
            y: precise2(item.cum_activations),
            date: dateTimeFmt(item.timestamp),
            epoch: item.epoch,
          }))

      const prev2EpochInvitesData =
        result &&
        result.data &&
        result.data
          .filter((item) => item.epoch === epoch - 2)
          .map((item) => ({
            x: precise2(item.share_of_period * 100),
            y: precise2(item.cum_activations),
            date: dateTimeFmt(item.timestamp),
            epoch: item.epoch,
          }))
      const data = {
        currEpochInvites: {data: currEpochInvitesData, epoch: 76},
        prev1EpochInvites: {data: prev1EpochInvitesData, epoch: 75},
        prev2EpochInvites: {data: prev2EpochInvitesData, epoch: 74},
      }

      setChartData({data, date: result.date})
    }
    getData()
  }, [])

  return (
    <Layout title="Invite Activations Progress">
      <ChartHeader
        title="Invites Activation Progress"
        descr="This chart shows the total number of activated invitations during the current epoch compared to the previous epochs."
        actualDate={chartData.date}
      />

      <section className="section section_info">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataInviteProgressScatterChart
                chartData={chartData.data}
                valueName="Total invites activated"
                xValueName="Epoch progress"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default InviteActivations
