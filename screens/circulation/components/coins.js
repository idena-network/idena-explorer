import {useEffect, useState} from 'react'
import {getCirculatingSupply, getTotalCoins} from '../../../shared/api'
import {precise2, dnaFmt} from '../../../shared/utils/utils'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  circulatingSupply: '-',
  totalSupply: '-',
  vestedCoins: '-',
  stakedCoins: '-',
}

export default function Coins() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [circulation, totalCoins] = await Promise.all([
        getCirculatingSupply(),
        getTotalCoins(),
      ])
      const totalSupply = precise2(
        1 * totalCoins.totalBalance + 1 * totalCoins.totalStake
      )
      setState({
        circulatingSupply: dnaFmt(precise2(circulation), ''),
        totalSupply: dnaFmt(totalSupply, ''),
        vestedCoins: dnaFmt(
          precise2(totalSupply - circulation - totalCoins.totalStake),
          ''
        ),
        stakedCoins: dnaFmt(precise2(totalCoins.totalStake), ''),
      })
    }
    getData()
  }, [])

  return (
    <>
      <div className="col-12 col-sm-4">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <div className="col-12 col-sm-12 bordered-col">
                <h3 className="info_block__accent">
                  {state.circulatingSupply}
                </h3>
                <TooltipText
                  className="control-label"
                  data-toggle="tooltip"
                  tooltip="Total supply minus vested and staked coins"
                >
                  Circulating supply
                </TooltipText>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-8">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <div className="col-12 col-sm-4 bordered-col">
                <h3 className="info_block__accent">{state.totalSupply}</h3>
                <TooltipText
                  className="control-label"
                  data-toggle="tooltip"
                  tooltip="Total coins available (including vested and staked coins)"
                >
                  Total supply
                </TooltipText>
              </div>
              <div className="col-12 col-sm-4 bordered-col">
                <h3 className="info_block__accent">{state.vestedCoins}</h3>
                <TooltipText
                  className="control-label"
                  data-toggle="tooltip"
                  tooltip="Vested coins (see details below)"
                >
                  Vested coins
                </TooltipText>
              </div>
              <div className="col-12 col-sm-4 bordered-col">
                <h3 className="info_block__accent">{state.stakedCoins}</h3>
                <TooltipText
                  className="control-label"
                  data-toggle="tooltip"
                  tooltip="Locked coins minted for identities' stakes"
                >
                  Staked coins
                </TooltipText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
