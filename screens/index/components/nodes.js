import Link from 'next/link'
import {useEffect, useState} from 'react'
import {getOnlineValidatorsCount, getPeersHistory} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  validators: '-',
  peers: '-',
}

export default function Identities() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [validators, result] = await Promise.all([
        getOnlineValidatorsCount(),
        getPeersHistory(1),
      ])
      setState({
        validators,
        peers: result && result[0] && result[0].count,
      })
    }
    getData()
  }, [])

  return (
    <div className="col-12 col-sm-4">
      <h1>Nodes</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-6 bordered-col ">
              <Link href="/charts/peers" as="/charts/peers">
                <a className="link-col">
                  <h3 className="accent">
                    <span>{state.peers}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total number of full nodes discovered in the network"
                  >
                    Total nodes &rsaquo;
                  </TooltipText>
                </a>
              </Link>
            </div>

            <div className="col-12 col-sm-6 bordered-col ">
              <Link href="/charts/validators" as="/charts/validators">
                <a className="link-col">
                  <h3 className="accent">
                    <span>{state.validators}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Mining nodes run by individual identities and pool owners activated online status"
                  >
                    Mining nodes &rsaquo;
                  </TooltipText>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
