import {useEffect, useState} from 'react'
import Link from 'next/link'
import {precise2, dnaFmt} from '../../../shared/utils/utils'
import {getAddressInfo} from '../../../shared/api'

const vestedData = [
  {
    address: '0x5b8896aEd1d98604c00bAcF1643F752949Fe807D',
    name: 'Early investors fund vested for 1 year',
    date: 'August 31, 2020',
    descr: '',
  },
  {
    address: '0x9bf19e7d58B2A95aaBD0cB8bd0Bc7da1c72E696b',
    name: 'Early investors fund vested for 2 years',
    date: 'August 31, 2021',
    descr: '',
  },
  {
    address: '0x3A4fA594b3822649738bE2ab02CDF35Bf13a595A',
    name: 'Core team fund vested for 3 years',
    date: 'August 31, 2022',
    descr: '',
  },
  {
    address: '0x9e64044F2f4719D04FfE1FFBE8D0d5B684ffFbBD',
    name: 'Core team fund vested for 5 years',
    date: 'August 31, 2024',
    descr: '',
  },
  {
    address: '0x0a8B4b113d863c86f64E49a1270F7a4A9B65dAAc',
    name: 'Reserved runway funding 2020',
    date: '-',
    descr: '',
  },
  {
    address: '0x477E32166cd16C1b4909BE783347e705Aef3d5db',
    name: 'Reserved runway funding 2021-2022',
    date: 'January 1, 2021',
    descr: '',
  },
  {
    address: '0xc94D32638D71aBA05F0bDADE498948eF93944428',
    name: 'Ambassadors fund',
    date: '-',
    descr: '',
  },
  {
    address: '0xcbb98843270812eeCE07BFb82d26b4881a33aA91',
    name: 'Foundation wallet address',
    date: '-',
    descr: '',
  },
  {
    address: '0x4d60dC6A2CbA8c3EF1Ba5e1Eba5c12c54cEE6B61',
    name: 'Previous foundation wallet address',
    date: '-',
    descr: '',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    name: 'Zero wallet',
    date: '-',
    descr: '',
  },
]

export default function Vested() {
  const [state, setState] = useState([])

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        vestedData.map((item, idx) =>
          getAddressInfo(item.address).then((res) => ({
            ...res,
            ...vestedData[idx],
          }))
        )
      )

      setState(data)
    }
    loadData()
  }, [])

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th>
              Balance, <br />
              iDNA
            </th>
            <th>Purpose</th>
            <th style={{width: 150}}>
              Vesting <br />
              date
            </th>
          </tr>
        </thead>
        <tbody>
          {state.map((item) => (
            <tr key={item.address}>
              <td>
                <div className="user-pic">
                  <img
                    src={`https://robohash.idena.io/${item.address.toLowerCase()}`}
                    alt="pic"
                    width="32"
                  />
                </div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: 150}}
                >
                  <Link
                    href="/address/[address]"
                    as={`/address/${item.address}`}
                  >
                    <a>{item.address}</a>
                  </Link>
                </div>
              </td>
              <td>{dnaFmt(precise2(item.balance), '')}</td>
              <td>{item.name}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
