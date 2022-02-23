import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {dnaFmt} from '../../../shared/utils/utils'

export default function DataBarFlipsChart({chartData, valueName, xValueName}) {
  function CustomTooltip({payload, label, active}) {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            fontSize: '0.765rem',
            color: 'white',
            backgroundColor: '#53565c',
            padding: '12px',
            borderRadius: '4px',
            lineHeight: '3px',
          }}
        >
          <p className="label">{`${valueName}: ${
            payload &&
            payload[0] &&
            payload[0].payload &&
            dnaFmt(payload[0].payload.y, '')
          }`}</p>
          <p className="label">{`Total flips: ${
            payload &&
            payload[0] &&
            payload[0].payload &&
            dnaFmt(payload[0].payload.t, '')
          }`}</p>
          <p className="label">{`Share of reported flips: ${
            payload && payload[0] && payload[0].payload && payload[0].payload.z
          } %`}</p>
          <p className="label">{`${xValueName}: ${label}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{width: '100%', height: '35rem'}}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <Tooltip
            cursor={{stroke: 'white', strokeWidth: 3, fill: '#00000010'}}
            content={<CustomTooltip />}
          />
          <CartesianGrid vertical={false} strokeDasharray="1 1" />

          <Bar dataKey="y" stackid="a" fill="#578fffaa" />

          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="x"
            fontSize={12}
            tickMargin={12}
            tickLine={false}
            height={60}
            label={{
              value: xValueName,
              fontSize: 12,
              position: 'insideBottom',
            }}
          />

          <YAxis
            label={{
              value: valueName,
              fontSize: 12,
              angle: -90,
              position: 'insideLeft',
            }}
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
