import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import {dateFmt, dnaFmt} from '../../../shared/utils/utils'

export default function DataAreaCoinsChart({chartData, valueName, xValueName}) {
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
          <p className="label">{`${valueName}: ${dnaFmt(
            payload && payload[0] && payload[0].value
          )}`}</p>
          <p className="label">{`${xValueName}: ${dateFmt(label)}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{width: '100%', height: '35rem'}}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <Tooltip
            cursor={{stroke: 'white', strokeWidth: 3, fill: '#00000010'}}
            content={<CustomTooltip />}
          />
          <CartesianGrid vertical={false} strokeDasharray="1 1" />

          <defs>
            <linearGradient id="coins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#578fff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#578fff" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            name="Burnt"
            stackId="1"
            dataKey="y"
            stroke="#578fff"
            fill="url(#coins)"
            activeDot={{stroke: '#578fff', strokeWidth: 2, r: 3}}
          />

          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="x"
            fontSize={12}
            tickMargin={12}
            tickLine={false}
            tick={{strokeWidth: 2}}
            height={60}
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => dateFmt(tick)}
            label={{
              value: xValueName,
              fontSize: 12,
              position: 'insideBottom',
            }}
          />

          <YAxis
            label={{
              value: `${valueName}, iDNA`,
              fontSize: 12,
              angle: -90,
              position: 'insideLeft',
            }}
            unit="M"
            tickFormatter={(tick) => Math.round(tick / 100000) / 10}
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
