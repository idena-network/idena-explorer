import Link from 'next/link'
import {useEffect, useState} from 'react'
import {getCirculatingSupply, getTotalCoins} from '../../../shared/api'
import {precise1, dnaFmt} from '../../../shared/utils/utils'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  totalSupply: '-',
  totalBurnt: '-',
  circulatingSupply: '-',
}

export default function Supply() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [supply, totalCoins] = await Promise.all([
        getCirculatingSupply(),
        getTotalCoins(),
      ])
      setState({
        totalSupply: dnaFmt(
          precise1(
            (parseFloat(totalCoins.totalBalance) +
              parseFloat(totalCoins.totalStake)) /
              1000000
          ),
          'M'
        ),
        totalBurnt: dnaFmt(precise1(totalCoins.burnt / 1000000), 'M'),
        circulatingSupply: dnaFmt(precise1(supply / 1000000), 'M'),
      })
    }
    getData()
  }, [])

  return (
    <div className="col-12 col-sm-4">
      <h1>Сoins, iDNA</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-12 ">
              <Link href="/circulation">
                <a className="link-col">
                  <div className="row">
                    <div className="col-12 col-sm-6 bordered-col">
                      <h3 className="accent">{state.circulatingSupply}</h3>
                      <TooltipText
                        tooltip="Circulating supply"
                        className="control-label"
                        data-toggle="tooltip"
                      >
                        Supply
                      </TooltipText>
                    </div>
                    <div className="col-12 col-sm-6 bordered-col">
                      <h3 className="accent">{state.totalBurnt}</h3>
                      <TooltipText
                        className="control-label"
                        data-toggle="tooltip"
                        tooltip="Coins burnt by protocol (fees, penalties, lost stakes, etc.)"
                      >
                        Burnt coins
                      </TooltipText>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
