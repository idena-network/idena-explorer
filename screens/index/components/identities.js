import Link from 'next/link'
import {useEffect, useState} from 'react'
import {
  getOnlineMinersCount,
  getOnlineIdentitiesCount,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  validators: '-',
  online: '-',
  total: '-',
}

export default function Identities() {
  const [state, setState] = useState(initialState)

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

  return (
    <div className="col-12 col-sm-4">
      <h1>Identities</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-6 bordered-col ">
              <Link href="/charts/identities" as="/charts/identities">
                <a className="link-col">
                  <h3 className="accent">
                    <span>{state.total}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Validated identities"
                  >
                    Total &rsaquo;
                  </TooltipText>
                </a>
              </Link>
            </div>

            <div className="col-12 col-sm-6 bordered-col ">
              <Link href="/charts/miners" as="/charts/miners">
                <a className="link-col">
                  <h3 className="accent">
                    <span>{state.online}</span>
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total mining identities. Click for stats"
                  >
                    Active miners &rsaquo;
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
