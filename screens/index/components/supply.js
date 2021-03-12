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
        totalBurnt: dnaFmt(precise1(totalCoins.burnt / 1000000), 'M iDNA'),
        circulatingSupply: dnaFmt(Math.round(supply)),
      })
    }
    getData()
  }, [])

  return (
    <div className="col-12 col-sm-6">
      <h1>Coins</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-8 bordered-col">
              <Link href="/circulation">
                <div className="info_block__link">
                  <h3 className="info_block__accent">
                    {state.circulatingSupply}
                  </h3>
                  <TooltipText
                    tooltip="Click to see details about total / cirtulating supply"
                    className="control-label"
                    data-toggle="tooltip"
                  >
                    Total / circulating supply
                  </TooltipText>
                </div>
              </Link>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">{state.totalBurnt}</h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Coins burnt by protocol (fees, penalties, lost stakes, etc.)"
              >
                Burnt coins
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
