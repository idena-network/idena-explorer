import Link from 'next/link'
import TooltipText from '../../../shared/components/tooltip'

export default function Coins({coinsData}) {
  return (
    <>
      <div className="col-12 col-sm-4">
        <div className="card">
          <div className="info_block">
            <div className="row">
              <div className="col-12 col-sm-12 bordered-col">
                <Link href="/charts/totalsupply">
                  <a className="link-col">
                    <h3 className="accent">{coinsData.totalSupply}</h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Total coins available (including vested and staked coins)"
                    >
                      Total supply
                    </TooltipText>
                  </a>
                </Link>
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
                <Link href="/charts/circulatingsupply">
                  <a className="link-col">
                    <h3 className="accent">{coinsData.circulatingSupply}</h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Total supply minus vested and staked coins"
                    >
                      Circulating supply
                    </TooltipText>
                  </a>
                </Link>
              </div>
              <div className="col-12 col-sm-4 bordered-col">
                <Link href="/charts/vested">
                  <a className="link-col">
                    <h3 className="accent">{coinsData.vestedCoins}</h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Vested coins (click for details)"
                    >
                      Vested coins
                    </TooltipText>
                  </a>
                </Link>
              </div>
              <div className="col-12 col-sm-4 bordered-col">
                <Link href="/charts/staked">
                  <a className="link-col">
                    <h3 className="accent">{coinsData.stakedCoins}</h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Locked coins minted for identities' stakes"
                    >
                      Staked coins
                    </TooltipText>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
