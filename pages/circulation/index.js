import {useEffect, useState} from 'react'
import Layout from '../../shared/components/layout'
import Coins from '../../screens/circulation/components/coins'
import DataPieCoinsChart from '../../screens/charts/components/datapiecoins'
import {getCirculatingSupply, getTotalCoins} from '../../shared/api'
import {dnaFmt, precise2} from '../../shared/utils/utils'
import ChartHeader from '../../screens/charts/components/chartheader'

function Circulation() {
  const initialState = {
    circulatingSupply: '-',
    totalSupply: '-',
    vestedCoins: '-',
    stakedCoins: '-',
  }
  const initialChartData = [
    {name: 'Circulating supply', value: 0},
    {name: 'Vested coins', value: 0},
    {name: 'Staked coins', value: 0},
  ]

  const [state, setState] = useState(initialState)
  const [chartData, setChartData] = useState(initialChartData)

  useEffect(() => {
    async function getData() {
      const [circulation, totalCoins] = await Promise.all([
        getCirculatingSupply(),
        getTotalCoins(),
      ])
      const totalSupply = precise2(
        1 * totalCoins.totalBalance + 1 * totalCoins.totalStake
      )
      const vested = totalSupply - circulation - totalCoins.totalStake
      setState({
        circulatingSupply: dnaFmt(precise2(circulation), ''),
        totalSupply: dnaFmt(totalSupply, ''),
        vestedCoins: dnaFmt(precise2(vested), ''),
        stakedCoins: dnaFmt(precise2(totalCoins.totalStake), ''),
      })

      setChartData([
        {name: 'Circulating supply', value: circulation * 1},
        {name: 'Vested coins', value: vested},
        {name: 'Staked coins', value: totalCoins.totalStake * 1},
      ])
    }
    getData()
  }, [])

  return (
    <Layout title="Circulating supply (iDNA)">
      <ChartHeader title="Total supply" />

      <section className="section section_info">
        <div className="row">
          <Coins coinsData={state} />
        </div>
      </section>

      <section className="section section_info">
        <h3>Total supply structure</h3>
        <div className="card">
          <div className="info_block">
            <div className="row">
              <DataPieCoinsChart
                chartData={chartData}
                valueName="Circulating Supply"
                xValueName="Date"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Circulation
