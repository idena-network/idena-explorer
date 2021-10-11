import Link from 'next/link'
import {useEffect, useState} from 'react'
import {AreaChart, Area, Tooltip, ResponsiveContainer} from 'recharts'
import {getEpochsData} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

export default function Stats() {
  const [chartData, setChartData] = useState([
    {name: 0, value: 0},
    {name: 1, value: 1},
  ])

  useEffect(() => {
    async function getData() {
      const epochData = await getEpochsData(100)
      const nextChartData = epochData
        .reverse()
        .map((item) => ({
          epoch: item.epoch + 1,
          date: item.validationTime,
          network: item.validatedCount,
        }))
        .splice(0, epochData.length - 1)
      setChartData(nextChartData)
    }
    getData()
  }, [])

  return (
    <div className="col-12 col-sm-4">
      <h1>Stats and charts</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-12 bordered-col ">
              <TooltipText
                data-toggle="tooltip"
                tooltip="Click to view more stats"
              >
                <div>
                  <Link href="/charts" as="/charts">
                    <a href="/charts" className="link-col">
                      <div className="mini-chart">
                        <ResponsiveContainer>
                          <AreaChart data={chartData}>
                            <Area
                              type="monotone"
                              dataKey="network"
                              stroke="#578fff"
                              fill="#578fffaa"
                              strokeWidth={2}
                              activeDot={{r: 3}}
                              dot={{r: 0}}
                            />
                            {
                              // <Tooltip cursor={false} content={<CustomTooltip />} />
                            }
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="control-label">
                        Network stats &rsaquo;
                      </div>
                    </a>
                  </Link>
                </div>
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
