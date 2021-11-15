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
  const colors = {
    supply: '#578fff',
    staked: '#ff6666',
    vested: '#27d980',
    burnt: '#d2d4d9',
  }

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
            <span style={{color: `${colors.burnt}`, marginRight: '3px'}}>•</span>

            {`Burnt: ${dnaFmt(payload && payload[1] && payload[1].value)}`}
          </p>
          <p className="label">
            <span style={{color: `${colors.supply}`, marginRight: '3px'}}>•</span>

            {`Total Supply: ${dnaFmt(
              payload && payload[0] && payload[0].value
            )}`}
          </p>
          <p className="label">
            <span style={{color: `${colors.vested}`, marginRight: '3px'}}>•</span>
            {`Vested: ${dnaFmt(payload && payload[3] && payload[3].value)}`}
          </p>
          <p className="label">
            <span style={{color: `${colors.staked}`, marginRight: '3px'}}>•</span>

            {`Staked: ${dnaFmt(payload && payload[2] && payload[2].value)}`}
          </p>
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
              <stop offset="5%" stopColor={colors.supply} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.supply} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBurnt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.burnt} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.burnt} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.vested} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.vested} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor={colors.staked} stopOpacity={0.8} />
              <stop offset="99%" stopColor={colors.staked} stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            name="Total Supply"
            stackId="1"
            dataKey="totalSupply"
            stroke={colors.supply}
            fill="url(#colorTotalSupply)"
            activeDot={{stroke: `${colors.supply}`, strokeWidth: 2, r: 3}}
          />
          <Area
            type="monotone"
            name="Burnt"
            stackId="1"
            dataKey="burnt"
            stroke={colors.burnt}
            fill={colors.burnt}
            activeDot={{stroke: `${colors.burnt}`, strokeWidth: 2, r: 3}}
          />
          <Area
            type="monotone"
            name="Staked"
            stackId="2"
            dataKey="staked"
            stroke={colors.staked}
            fill="url(#colorStaked)"
            activeDot={{stroke: `${colors.staked}`, strokeWidth: 2, r: 3}}
          />

          <Area
            type="monotone"
            name="Vested"
            stackId="2"
            dataKey="vested"
            stroke={colors.vested}
            fill="url(#colorVested)"
            activeDot={{stroke: `${colors.vested}`, strokeWidth: 2, r: 3}}
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
