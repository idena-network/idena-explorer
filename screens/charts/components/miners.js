import {useEffect, useState} from 'react'
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
import {getMinersHistory} from '../../../shared/api'
import {dateTimeFmt} from '../../../shared/utils/utils'

function MinersHistory() {
  const [chartData, setChartData] = useState([])
  const [isFocused, setIsFocused] = useState('')

  const [isHide, setIsHide] = useState({
    onlineMiners: false,
    onlineValidators: false,
  })

  useEffect(() => {
    async function getData() {
      const result = await getMinersHistory()
      const data =
        result &&
        result.map((item) => ({
          onlineValidators: item.onlineValidators,
          onlineMiners: item.onlineMiners,
          timestamp: dateTimeFmt(item.timestamp),
        }))
      setChartData(data)
    }
    getData()
  }, [])

  const handleMouseEnter = (o) => {
    const {dataKey} = o
    setIsFocused(dataKey)
  }

  const handleMouseLeave = () => {
    setIsFocused('')
  }

  const handleClick = (o) => {
    const {dataKey} = o
    const newValue = !isHide[dataKey]
    setIsHide({...isHide, [dataKey]: newValue})
  }

  const legendTextFormatter = (value, entry) => {
    const {color} = entry
    return (
      (value === 'onlineValidators' && (
        <span
          style={{
            color,
            fontWeight: `${isFocused === 'onlineValidators' ? 900 : 500}`,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Full mining nodes
        </span>
      )) ||
      (value === 'onlineMiners' && (
        <span
          style={{
            color,
            fontWeight: `${isFocused === 'onlineMiners' ? 900 : 500}`,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Miners
        </span>
      ))
    )
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
          <p className="label">{`Full mining nodes: ${
            payload && payload[0] && payload[0].value
          }`}</p>
          <p className="label">{`Miners: ${
            payload && payload[1] && payload[1].value
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
          <Area
            dataKey="onlineValidators"
            stroke="#578fff"
            fillOpacity={0}
            strokeWidth={isFocused === 'onlineValidators' ? 3 : 2}
            activeDot={{r: 3}}
            dot={{r: 0}}
            hide={isHide.onlineValidators}
          />

          <Area
            yAxisId={1}
            dataKey="onlineMiners"
            stroke="#8f8f8f"
            fillOpacity={0}
            strokeWidth={isFocused === 'onlineMiners' ? 3 : 2}
            activeDot={{r: 3}}
            dot={{r: 0}}
            hide={isHide.onlineMiners}
          />
          <XAxis
            axisLine={false}
            strokeWidth={1}
            dataKey="timestamp"
            fontSize={12}
            reversed
            tickMargin={12}
          />

          <YAxis
            yAxisId={0}
            domain={['auto', 'auto']}
            label={{
              value: 'Full mining nodes',
              fontSize: 14,
              angle: -90,
              position: 'insideLeft',
            }}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />

          <YAxis
            yAxisId={1}
            orientation="right"
            domain={['auto', 'auto']}
            label={{
              value: 'Miners',
              fontSize: 14,
              angle: 90,
              position: 'insideRight',
            }}
            tickLine={false}
            axisLine={false}
            strokeWidth={1}
            fontSize={12}
          />
          <CartesianGrid vertical={false} strokeDasharray="1 1" />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Legend
            iconSize={14}
            iconType="plainline"
            height={36}
            formatter={legendTextFormatter}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MinersHistory
