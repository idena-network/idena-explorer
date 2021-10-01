import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function DataBarIdentitiesChart({
  chartData,
  valueName,
  xValueName,
}) {
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
          <p className="label">{`Zombie: ${
            payload && payload[4] && payload[4].value
          }`}</p>
          <p className="label">{`Suspended: ${
            payload && payload[3] && payload[3].value
          }`}</p>
          <p className="label">{`Human: ${
            payload && payload[2] && payload[2].value
          }`}</p>
          <p className="label">{`Verified: ${
            payload && payload[1] && payload[1].value
          }`}</p>
          <p className="label">{`Newbie: ${
            payload && payload[0] && payload[0].value
          }`}</p>
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

          <Bar name="Newbie" stackId="1" dataKey="newbie" fill="#ff6666" />
          <Bar name="Verified" stackId="1" dataKey="verified" fill="#578fff" />
          <Bar name="Human" stackId="1" dataKey="human" fill="#27d980" />
          <Bar
            name="Suspended"
            stackId="1"
            dataKey="suspended"
            fill="#96999e"
          />
          <Bar name="Zombie" stackId="1" dataKey="zombie" fill="#d2d4d9" />

          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="epoch"
            fontSize={12}
            tickMargin={12}
            tickLine={false}
            tick={{strokeWidth: 2}}
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

          <Legend
            verticalAlign="top"
            height={30}
            iconSize={9}
            wrapperStyle={{fontSize: '12px'}}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
