import Link from 'next/link'
import {useEffect, useState} from 'react'
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts'
import {getEpoch} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'
import {dateFmt, epochFmt} from '../../../shared/utils/utils'

const initialState = {
  startEpochDate: '-',
  endEpochDate: '-',
  epochLeftPercent: 100,
  epochDuration: '-',
  epochLeft: '-',
}

export default function Epoch({epochData}) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [{validationTime: prevValidationTime}] = await Promise.all([
        getEpoch(epochData.epoch - 1),
      ])

      const startEpochDate = new Date(prevValidationTime)
      const nowDate = new Date()
      const endEpochDate = new Date(epochData.validationTime)
      const epochDuration = Math.round(
        Math.abs((endEpochDate - startEpochDate) / 86400000)
      )
      const epochDurationMinutes = epochDuration * 24 * 60
      const epochLeftMinutes = Math.round(
        Math.max(0, ((endEpochDate - nowDate) / 86400000) * 24 * 60)
      )

      const epochLeftPercent = (epochLeftMinutes / epochDurationMinutes) * 100

      const {epochLeft, epochLeftUnit} =
        epochLeftMinutes < 60
          ? {epochLeft: epochLeftMinutes, epochLeftUnit: 'Minutes'}
          : epochLeftMinutes > 24 * 60
          ? {
              epochLeft: Math.round(epochLeftMinutes / 24 / 60),
              epochLeftUnit: 'Days',
            }
          : {
              epochLeft: Math.round(epochLeftMinutes / 60),
              epochLeftUnit: 'Hours',
            }
      setState({
        endEpochDate,
        epochDuration,
        epochLeftPercent,
        epochLeft,
        epochLeftUnit,
      })
    }
    if (epochData) getData()
  }, [epochData])

  const epochProgress = [
    {
      name: 'progress',
      value: Math.trunc(100 - state.epochLeftPercent),
      color: '#578fff',
      innerColor: '#578fff22',
    },
    {
      name: 'left',
      value: Math.ceil(state.epochLeftPercent),
      color: '#578fff22',
      innerColor: '#578fff00',
    },
  ]

  return (
    <div className="col-12 col-sm-4">
      <h1>{`Epoch ${epochData && epochFmt(epochData.epoch)}`}</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-12 ">
              <TooltipText
                data-toggle="tooltip"
                tooltip={
                  <>
                    <div>{`Epoch duration: ${state.epochDuration} days`}</div>
                    <div>{`Next validation: ${dateFmt(
                      state.endEpochDate
                    )} `}</div>
                  </>
                }
              >
                <div>
                  <Link
                    href="/epoch/[epoch]"
                    as={`/epoch/${epochData && epochData.epoch}`}
                  >
                    <a className="link-col">
                      <div className="row">
                        <div className="col-12 col-sm-6 bordered-col ">
                          <div className="mini-piechart">
                            <ResponsiveContainer height="100%">
                              <PieChart>
                                <Pie
                                  startAngle={90}
                                  endAngle={-270}
                                  data={epochProgress}
                                  dataKey="value"
                                  strokeWidth={0}
                                  innerRadius={43}
                                  outerRadius={45}
                                  dot={{r: 0}}
                                >
                                  {epochProgress.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={epochProgress[index].color}
                                    />
                                  ))}
                                </Pie>
                                <Pie
                                  startAngle={90}
                                  endAngle={-270}
                                  data={epochProgress}
                                  dataKey="value"
                                  strokeWidth={0}
                                  innerRadius={35}
                                  outerRadius={40}
                                  dot={{r: 0}}
                                >
                                  {epochProgress.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={epochProgress[index].innerColor}
                                    />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <h3 className="accent">
                              <span>
                                {100 - Math.ceil(state.epochLeftPercent)}%
                              </span>
                            </h3>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 bordered-col">
                          <h3 className="accent">
                            <span>{state.epochLeft}</span>
                          </h3>
                          <div className="control-label">
                            {state.epochLeftUnit} left
                          </div>
                        </div>
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
