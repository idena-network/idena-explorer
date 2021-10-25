import React, {useCallback, useState} from 'react'
import {PieChart, Pie, ResponsiveContainer, Sector, Cell} from 'recharts'
import {dnaFmt} from '../../../shared/utils/utils'

export default function DataPieCoinsChart({chartData}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex]
  )

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 12
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={14}
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          fontSize={12}
        >{` ${dnaFmt(Math.round(value / 100000) / 10, 'M iDNA')}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          fontSize={12}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const colors = ['#578fff', '#27d980', '#ff6666']

  return (
    <div style={{width: '100%', height: '320px'}}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            startAngle={-60}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
