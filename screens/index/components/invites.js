import Link from 'next/link'
import {useEffect, useState} from 'react'
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts'
import {
  getEpochIdentitiesSummary,
  getEpochInvitesSummary,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  totalCount: '-',
  issuedCount: '-',
  usedCount: '-',
  leftCount: '-',
  left: '-',
}

export default function Invites({epoch, epochData}) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [identitiesSummary, invitesSummary] = await Promise.all([
        getEpochIdentitiesSummary(epoch - 1),
        getEpochInvitesSummary(epoch),
      ])

      const getCount = (src, state) =>
        (src.find((x) => x.value === state) || {count: 0}).count

      const prevNodesCount =
        identitiesSummary && identitiesSummary.length
          ? getCount(identitiesSummary, 'Human') +
            getCount(identitiesSummary, 'Verified') +
            getCount(identitiesSummary, 'Newbie')
          : 0

      const totalCount = Math.round(prevNodesCount / 2 + prevNodesCount * 0.1)
      const {usedCount, allCount: issuedCount} = invitesSummary

      const left =
        // totalCount && Math.round(((totalCount - usedCount) / totalCount) * 100)
        totalCount && Math.round((usedCount / issuedCount) * 100)

      setState({
        totalCount,
        usedCount,
        issuedCount,
        leftCount: totalCount - usedCount,
        left,
      })
    }
    if (epoch) getData()
  }, [epoch])

  return (
    <div className="col-12 col-sm-4">
      <h1>Invites</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-6 bordered-col">
              <h3 className="accent">
                <span>{state.leftCount}</span>
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total invitations left"
              >
                Available
              </TooltipText>
            </div>

            <div className="col-12 col-sm-6 bordered-col">
              <h3 className="accent">
                <span>{state.usedCount}</span>
              </h3>

              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total invites activated"
              >
                Used
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MicroPie({val, val2 = val, maxVal = 100}) {
  const data = [
    {
      name: 'value',
      usedValue: val,
      issuedValue: val2,
      color: '#578fff',
      innerColor: '#578fff22',
    },
    {
      name: 'innerValue',
      usedValue: maxVal - val,
      issuedValue: maxVal - val2,
      color: '#578fff22',
      innerColor: '#578fff00',
    },
  ]
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          startAngle={180}
          endAngle={0}
          data={data}
          dataKey="value"
          strokeWidth={0}
          innerRadius={43}
          outerRadius={45}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={data[index].color} />
          ))}
        </Pie>
        <Pie
          startAngle={180}
          endAngle={0}
          data={data}
          dataKey="innerValue"
          strokeWidth={0}
          innerRadius={35}
          outerRadius={40}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={data[index].innerColor} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
