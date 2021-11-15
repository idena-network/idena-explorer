import CarouselIndicators from 'reactstrap/lib/CarouselIndicators'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {precise2} from '../../../shared/utils/utils'

export default function DataAreaFailsChart({chartData, valueName, xValueName}) {
  const colors = {
    blue: '#578fff',
    red: '#ff6666',
    green: '#27d980',
    orange: '#ffa366',
  }

  function CustomTooltip({payload, label, active}) {
    if (active) {
      const total =
        payload && payload.reduce((result, entry) => result + entry.value, 0)

      const totalAbs =
        payload &&
        payload[0] &&
        payload[0].payload &&
        payload[0].payload.abs &&
        payload[0].payload.abs.reduce((result, entry) => result + entry, 0)

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
          <p className="total">{`Total failures: ${precise2(
            total
          )}% (${totalAbs})`}</p>
          <div className="list">
            {payload &&
              payload.reverse().map((entry, index) => (
                <p key={`item-${index}`}>
                  <span style={{color: entry.color, marginRight: '3px'}}>
                    •
                  </span>
                  {`${entry.name}: ${precise2(entry.value)}% (${
                    entry.payload &&
                    entry.payload.abs &&
                    entry.payload.abs[entry.payload.abs.length - index - 1]
                  })
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
        <AreaChart data={chartData}>
          <YAxis
            label={{
              value: valueName,
              fontSize: 12,
              angle: -90,
              position: 'insideLeft',
            }}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            unit="%"
          />

          <Tooltip
            cursor={{stroke: 'white', strokeWidth: 3, fill: '#00000010'}}
            content={CustomTooltip}
          />

          <CartesianGrid vertical={false} strokeDasharray="1 1" />

          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.blue} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.blue} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.red} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.red} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor={colors.green} stopOpacity={0.8} />
              <stop offset="99%" stopColor={colors.green} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor={colors.orange} stopOpacity={0.8} />
              <stop offset="99%" stopColor={colors.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            name="Total score < 75%"
            stackId="1"
            dataKey="lowscore"
            stroke={colors.orange}
            fill="url(#colorOrange)"
            activeDot={{stroke: `${colors.orange}`, strokeWidth: 2, r: 3}}
          />
          <Area
            type="monotone"
            name="Late submission"
            stackId="1"
            dataKey="late"
            stroke={colors.blue}
            fill="url(#colorBlue)"
            activeDot={{stroke: `${colors.blue}`, strokeWidth: 2, r: 3}}
          />
          <Area
            type="monotone"
            name="Wrong answers"
            stackId="1"
            dataKey="wrong"
            stroke={colors.red}
            fill="url(#colorRed)"
            activeDot={{stroke: `${colors.red}`, strokeWidth: 2, r: 3}}
          />

          <Area
            type="monotone"
            name="Missing answers"
            stackId="1"
            dataKey="missing"
            stroke={colors.green}
            fill="url(#colorGreen)"
            activeDot={{stroke: `${colors.green}`, strokeWidth: 2, r: 3}}
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

          <Legend
            verticalAlign="top"
            height={30}
            iconSize={9}
            wrapperStyle={{fontSize: '12px'}}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
