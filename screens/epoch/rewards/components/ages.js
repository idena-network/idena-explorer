import Link from 'next/link'
import {useEffect, useState} from 'react'
import {getCoingeckoData, getEpochRewardBounds} from '../../../../shared/api'
import {precise2} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

function ageFmt(age) {
  if (age >= 6) return '6+'
  return age
}

function typeFmt(type) {
  if (type === 1) return 'Newbie'
  if (type === 2) return 'Newbie'
  if (type === 3) return 'Verified or Newbie'
  if (type === 4) return 'Human or Verified'
  if (type === 5) return 'Human or Verified'
  if (type === 6) return 'Human or Verified'
}

export default function Ages({epoch, visible}) {
  const [data, setData] = useState(null)
  const [price, setPrice] = useState(null)

  useEffect(() => {
    async function getData() {
      const [{idena}] = await Promise.all([getCoingeckoData()])
      setPrice(idena && idena.usd)
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const rewardBounds = await getEpochRewardBounds(epoch)
      setData(rewardBounds)
    }
    if (epoch > 0) getData()
  }, [epoch])

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Age</th>
            <th>Identity status</th>
            <th>
              Reward per
              <br /> user, iDNA
            </th>
            <th>
              Reward per
              <br /> user, USD
            </th>
            <th style={{width: 100}}>Examples</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (!data && <SkeletonRows cols={5} />)}
          {data &&
            data.map((item) => (
              <tr key={item.type}>
                <td>{ageFmt(item.type)}</td>
                <td>{typeFmt(item.type)}</td>
                <td>
                  {`${precise2(item.min.amount) || ''} - ${
                    precise2(item.max.amount) || ''
                  }`}
                </td>

                <td>
                  {`$${precise2(item.min.amount * price) || ''} - $${
                    precise2(item.max.amount * price) || ''
                  }`}
                </td>

                <td>
                  <div className="user-pic">
                    <img
                      src={`https://robohash.idena.io/${item.min.address.toLowerCase()}`}
                      alt="pic"
                      width="32"
                    />
                  </div>
                  <div
                    className="text_block text_block--ellipsis"
                    style={{width: 150}}
                  >
                    <Link
                      href="/identity/[address]/epoch/[epoch]/rewards"
                      as={`/identity/${item.min.address}/epoch/${
                        epoch + 1
                      }/rewards`}
                    >
                      <a>{item.min.address}</a>
                    </Link>
                  </div>

                  <div className="user-pic">
                    <img
                      src={`https://robohash.idena.io/${item.max.address.toLowerCase()}`}
                      alt="pic"
                      width="32"
                    />
                  </div>
                  <div
                    className="text_block text_block--ellipsis"
                    style={{width: 150}}
                  >
                    <Link
                      href="/identity/[address]/epoch/[epoch]/rewards"
                      as={`/identity/${item.max.address}/epoch/${
                        epoch + 1
                      }/rewards`}
                    >
                      <a>{item.max.address}</a>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
