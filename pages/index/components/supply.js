import {useEffect, useState} from 'react'
import {getCirculationSupply, getTotalCoins} from '../../../shared/api'
import {precise2, dnaFmt} from '../../../shared/utils/utils'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  totalSupply: '-',
  totalBurnt: '-',
  circulationSupply: '-',
}

export default function Supply() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [supply, totalCoins] = await Promise.all([
        getCirculationSupply(),
        getTotalCoins(),
      ])
      setState({
        totalSupply: dnaFmt(
          precise2(
            parseFloat(totalCoins.totalBalance) +
              parseFloat(totalCoins.totalStake)
          )
        ),
        totalBurnt: dnaFmt(precise2(totalCoins.burnt)),
        circulationSupply: dnaFmt(precise2(supply)),
      })
    }
    getData()
  }, [])

  return (
    <div className="col-12 col-sm-9">
      <h1>Coins supply</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">{state.totalSupply}</h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total coins available (including staked coins)"
              >
                Total supply
              </TooltipText>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">{state.circulationSupply}</h3>
              <TooltipText
                tooltip="Total supply minus by vested and staked coins"
                className="control-label"
                data-toggle="tooltip"
              >
                Circulating supply
              </TooltipText>
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
