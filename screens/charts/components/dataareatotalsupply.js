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
import {dateFmt, dnaFmt} from '../../../shared/utils/utils'

export default function DataAreaTotalSupplyChart({
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
          <p className="label">
            {`Burnt: ${dnaFmt(payload && payload[1] && payload[1].value)}`}
          </p>
          <p className="label">{`Total Supply: ${dnaFmt(
            payload && payload[0] && payload[0].value
          )}`}</p>
          <p className="label">{`Vested: ${dnaFmt(
            payload && payload[3] && payload[3].value
          )}`}</p>
          <p className="label">{`Staked: ${dnaFmt(
            payload && payload[2] && payload[2].value
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
            <linearGradient id="colorTotalSupply" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#578fff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#578fff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBurnt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d2d4d9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#d2d4d9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#27d980" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#27d980" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor="#ff6666" stopOpacity={0.8} />
              <stop offset="99%" stopColor="#ff6666" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            name="Total Supply"
            stackId="1"
            dataKey="totalSupply"
            stroke="#578fff"
            fill="url(#colorTotalSupply)"
            activeDot={{stroke: '#578fff', strokeWidth: 2, r: 3}}
          />
          <Area
            name="Burnt"
            stackId="1"
            dataKey="burnt"
            stroke="#d2d4d9"
            fill="#d2d4d9"
            activeDot={{stroke: '#d2d4d9', strokeWidth: 2, r: 3}}
          />
          <Area
            name="Staked"
            stackId="2"
            dataKey="staked"
            stroke="#ff6666"
            fill="url(#colorStaked)"
            activeDot={{stroke: '#ff6666', strokeWidth: 2, r: 3}}
          />

          <Area
            name="Vested"
            stackId="2"
            dataKey="vested"
            stroke="#27d980"
            fill="url(#colorVested)"
            activeDot={{stroke: '#27d980', strokeWidth: 2, r: 3}}
          />

          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="timestamp"
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
              value: valueName,
              fontSize: 12,
              angle: -90,
              position: 'insideLeft',
            }}
            unit="M"
            tickFormatter={(tick) => Math.round(tick / 1000000)}
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
