import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {epochFmt} from '../../../shared/utils/utils'

export default function DataInviteProgressScatterChart({
  chartData,
  valueName,
  xValueName,
}) {
  function CustomTooltip({payload, active}) {
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
          <p className="label">{`Epoch: ${
            payload &&
            payload[0] &&
            payload[0].payload &&
            epochFmt(payload[0].payload.epoch)
          }`}</p>
          <p className="label">{`${valueName}: ${
            payload && payload[1] && payload[1].value
          }`}</p>
          <p className="label">{`${xValueName}: ${
            payload && payload[0] && `${payload[0].value}%`
          }`}</p>
          <p className="label">{`Timestamp: ${
            payload &&
            payload[0] &&
            payload[0].payload &&
            payload[0].payload.date
          }`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{width: '100%', height: '35rem'}}>
      <ResponsiveContainer>
        <ScatterChart>
          <Tooltip
            cursor={{stroke: 'white', strokeWidth: 3, fill: '#00000010'}}
            content={<CustomTooltip />}
          />
          <CartesianGrid vertical={false} strokeDasharray="1 1" />

          <Scatter
            name={
              chartData &&
              chartData.currEpochInvites &&
              `Epoch ${epochFmt(chartData.currEpochInvites.epoch - 2)}`
            }
            data={
              chartData &&
              chartData.prev2EpochInvites &&
              chartData.prev2EpochInvites.data
            }
            fill="#d2d4d9"
            line={{stroke: '#d2d4d9', strokeWidth: 2}}
          />

          <Scatter
            name={
              chartData &&
              chartData.currEpochInvites &&
              `Epoch ${epochFmt(chartData.currEpochInvites.epoch - 1)}`
            }
            data={
              chartData &&
              chartData.prev1EpochInvites &&
              chartData.prev1EpochInvites.data
            }
            fill="#96999e99"
            line={{stroke: '#9699ae99', strokeWidth: 2}}
          />

          <Scatter
            name={
              chartData &&
              chartData.currEpochInvites &&
              `Epoch ${epochFmt(chartData.currEpochInvites.epoch)}`
            }
            data={
              chartData &&
              chartData.currEpochInvites &&
              chartData.currEpochInvites.data
            }
            fill="#578fff"
            line={{stroke: '#578fff', strokeWidth: 4}}
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
            label={{
              value: `${xValueName}, %`,
              fontSize: 12,
              position: 'insideBottom',
            }}
          />

          <YAxis
            label={{
              value: `${valueName}`,
              fontSize: 12,
              angle: -90,
              position: 'insideLeft',
            }}
            dataKey="y"
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />
          <ZAxis type="number" range={[70]} />
          <Legend
            verticalAlign="top"
            height={30}
            iconSize={9}
            wrapperStyle={{fontSize: '12px'}}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
