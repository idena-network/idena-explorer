import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

export default function DataAreaChart({chartData, valueName}) {
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
            payload && payload[0] && payload[0].value
          }`}</p>
          <p className="label">{`Timestamp: ${label}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{width: '100%', height: '35rem'}}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#578fffaa" stopOpacity={0.7} />
              <stop offset="90%" stopColor="#578fffaa" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            dataKey="y"
            stroke="#578fff"
            fillOpacity={1}
            fill="url(#colorUv)"
            strokeWidth={2}
            activeDot={{r: 3}}
            dot={{r: 0}}
          />

          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="x"
            fontSize={12}
            reversed
            tickMargin={12}
          />

          <YAxis
            label={{
              value: valueName,
              fontSize: 14,
              angle: -90,
              position: 'insideLeft',
            }}
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />

          <CartesianGrid vertical={false} strokeDasharray="1 1" />
          <Tooltip cursor={false} content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
