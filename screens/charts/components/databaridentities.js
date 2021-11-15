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
import {precise2} from '../../../shared/utils/utils'

export default function DataBarIdentitiesChart({
  chartData,
  valueName,
  xValueName,
}) {
  const colors = {
    verified: '#578fff',
    newbie: '#ff6666',
    human: '#27d980',
    suspended: '#96999e',
    zombie: '#d2d4d9',
  }

  function CustomTooltip({payload, label, active}) {
    if (active) {
      const total =
        payload && payload.reduce((result, entry) => result + entry.value, 0)

      const totalRate =
        payload &&
        payload[0] &&
        payload[0].payload &&
        payload[0].payload.rates &&
        payload[0].payload.rates.reduce((result, entry) => result + entry, 0)

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
          <p className="total">{`Epoch: ${label}`}</p>
          <p className="total">{`Total: ${total} (${precise2(totalRate)}%)`}</p>
          <div className="list">
            {payload &&
              payload.reverse().map((entry, index) => (
                <p key={`item-${index}`}>
                  <span style={{color: entry.color, marginRight: '3px'}}>
                    •
                  </span>
                  {`${entry.name}: ${entry.value} (${
                    entry.payload &&
                    entry.payload.rates &&
                    precise2(
                      entry.payload.rates[
                        entry.payload.rates.length - index - 1
                      ]
                    )
                  }%)
                  `}
                </p>
              ))}
          </div>
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

          <Bar
            name="Newbie"
            stackId="1"
            dataKey="newbie"
            fill={colors.newbie}
          />
          <Bar
            name="Verified"
            stackId="1"
            dataKey="verified"
            fill={colors.verified}
          />
          <Bar name="Human" stackId="1" dataKey="human" fill={colors.human} />
          <Bar
            name="Suspended"
            stackId="1"
            dataKey="suspended"
            fill={colors.suspended}
          />
          <Bar
            name="Zombie"
            stackId="1"
            dataKey="zombie"
            fill={colors.zombie}
          />

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
