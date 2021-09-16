import {useEffect, useState} from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {getHardForkVotingHistory} from '../../../shared/api'
import {dateTimeFmt} from '../../../shared/utils/utils'

export default function HardForkHistory({upgrade = 0, votesRequired = 0}) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function getData() {
      const result = await getHardForkVotingHistory(upgrade)
      const data =
        result &&
        result.map((item) => ({
          votes: item.votes,
          timestamp: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [upgrade])

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
          <p className="label">{`Votes: ${payload && payload.length && payload[0] && payload[0].value}`}</p>
          <p className="label">{`Timestamp: ${label}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{width: '100%', height: '15rem'}}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#578fffaa" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#578fffaa" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="stepAfter"
            dataKey="votes"
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
            dataKey="timestamp"
            fontSize={12}
          />
          <YAxis
            label={{
              value: 'Votes',
              fontSize: 14,
              angle: -90,
              position: 'insideLeft',
            }}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />
          {votesRequired && (
            <ReferenceLine
              y={votesRequired}
              label={{
                value: '',
                fontSize: 12,
                fontStyle: {fontColor: 'red'},

                position: 'insideBottomLeft',
                offset: 5,
              }}
              stroke="red"
              strokeDasharray="4 4"
            />
          )}
          <CartesianGrid vertical={false} strokeDasharray="1 1" />
          <Tooltip cursor={false} content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
