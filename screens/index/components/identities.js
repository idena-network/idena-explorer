import Link from 'next/link'
import {useEffect, useState} from 'react'
import {AreaChart, Area, Tooltip, ResponsiveContainer} from 'recharts'
import {
  getOnlineMinersCount,
  getOnlineIdentitiesCount,
  getEpochsData,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  epoch: 0,
  online: '-',
  total: '-',
}

export default function Identities({epoch}) {
  const [state, setState] = useState(initialState)
  const [chartData, setChartData] = useState([
    {name: 0, value: 0},
    {name: 1, value: 1},
  ])

  useEffect(() => {
    async function getData() {
      const [online, total] = await Promise.all([
        getOnlineMinersCount(),
        getOnlineIdentitiesCount(),
      ])
      setState({
        online,
        total,
      })
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const epochData = await getEpochsData(1, 50)
      const nextChartData = epochData.reverse().map((item) => {
        return {
          epoch: item.epoch + 1,
          date: item.validationTime,
          network: item.validatedCount,
        }
      })
      setChartData(nextChartData)
    }
    getData()
  }, [])

  function getEpochInfo(index) {
    return chartData[index]
  }

  function CustomTooltip({payload, label, active}) {
    if (active) {
      const epochInfo = getEpochInfo(label)
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
          <p className="label">{`Size: ${payload[0].value}`}</p>
          <p className="label">{`Epoch: ${epochInfo.epoch}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="col-12 col-sm-6">
      <h1>Network</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-4 bordered-col">
              <div style={{width: '100%', height: '2.43rem'}}>
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
                    <Tooltip cursor={false} content={<CustomTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <TooltipText
                className="control-label hide-border"
                data-toggle="tooltip"
                tooltip="View more network stats at https://idena.today"
              >
                <a href="https://idena.today" target="blank">
                  Network stats &rsaquo;
                </a>
              </TooltipText>
            </div>

            <div className="col-12 col-sm-4 bordered-col">
              <Link href="/epoch/[epoch]" as={`/epoch/${epoch}`}>
                <div className="info_block__link">
                  <h3 className="info_block__accent">
                    <span>{state.total}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total validated identities / Online mining nodes"
                  >
                    Total nodes
                  </TooltipText>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                <span>{state.online}</span>
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total validated identities / Online mining nodes"
              >
                Online miners
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
