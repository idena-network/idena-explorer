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
}

export default function Invites({epoch}) {
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

      const totalCount = Math.max(
        500,
        Math.round(prevNodesCount / 2 + prevNodesCount * 0.1)
      )
      const {usedCount, allCount: issuedCount} = invitesSummary

      setState({
        totalCount,
        usedCount,
        issuedCount,
        leftCount: Math.max(0, totalCount - usedCount),
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
                <MicroPie
                  val={state.usedCount}
                  maxVal={state.leftCount + state.usedCount}
                />
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

function MicroPie({val, innerVal = val, maxVal = 100, size = 11}) {
  const data = [
    {
      name: 'value',
      value: val,
      innerValue: innerVal,
      color: '#578fff',
      innerColor: '#578fff22',
    },
    {
      name: 'innerValue',
      value: Math.max(0, maxVal - val),
      innerValue: Math.max(0, maxVal - innerVal),
      color: '#578fff22',
      innerColor: '#578fff00',
    },
  ]
  return (
    <div className="microPie">
      <ResponsiveContainer width="100%">
        <PieChart>
          <Pie
            startAngle={90}
            endAngle={-270}
            data={data}
            dataKey="value"
            strokeWidth={0}
            innerRadius={size - 2}
            outerRadius={size}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={data[index].color} />
            ))}
          </Pie>
          <Pie
            startAngle={90}
            endAngle={-270}
            data={data}
            dataKey="innerValue"
            strokeWidth={0}
            innerRadius={0}
            outerRadius={size - 2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={data[index].innerColor} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
