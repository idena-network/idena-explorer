import Link from 'next/link'
import {useEffect, useState} from 'react'
import {AreaChart, Area, Tooltip, ResponsiveContainer} from 'recharts'
import {
  getOnlineValidatorsCount,
  getOnlineMinersCount,
  getOnlineIdentitiesCount,
  getEpochsData,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  validators: '-',
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
      const [validators, online, total] = await Promise.all([
        getOnlineValidatorsCount(),
        getOnlineMinersCount(),
        getOnlineIdentitiesCount(),
      ])
      setState({
        validators,
        online,
        total,
      })
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const epochData = await getEpochsData(51)
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
          <p className="label">{`Size: ${payload[0] && payload[0].value}`}</p>
          <p className="label">{`Epoch: ${epochInfo.epoch}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="col-12 col-sm-7">
      <h1>Network</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-3 bordered-col">
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
                className="control-label"
                data-toggle="tooltip"
                tooltip="Click to view more stats at https://idena.today"
              >
                <a href="https://idena.today" target="blank">
                  Network stats &rsaquo;
                </a>
              </TooltipText>
            </div>

            <div className="col-12 col-sm-3 bordered-col">
              {/* TODO: add actual epoch stats with terminated identities
              <Link href="/epoch/[epoch]" as={`/epoch/${epoch}`}> 
              <div className="info_block__link"> */}
              <h3 className="info_block__accent">
                <span>{state.total}</span>
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Validated identities"
              >
                Identities
              </TooltipText>
              {/* </div>
               </Link> */}
            </div>

            <div className="col-12 col-sm-3 bordered-col">
              <Link href="/charts/miners" as="/charts/miners">
                <div className="info_block__link">
                  <h3 className="info_block__accent">
                    <span>{state.online}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total mining identities. Click for stats"
                  >
                    Active miners &rsaquo;
                  </TooltipText>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-3 bordered-col">
              <Link href="/charts/validators" as="/charts/validators">
                <div className="info_block__link">
                  <h3 className="info_block__accent">
                    <span>{state.validators}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Full mining nodes run by individual identities and pool owners activated online status. Click for stats"
                  >
                    Mining nodes &rsaquo;
                  </TooltipText>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
