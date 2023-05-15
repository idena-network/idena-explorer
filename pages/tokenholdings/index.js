import {useRouter} from 'next/router'
import Link from 'next/dist/client/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import Layout from '../../shared/components/layout'
import {getAddressInfo, getAddressTokens} from '../../shared/api'
import {SkeletonRows} from '../../shared/components/skeleton'
import {precise6, tokenBalanceFmt} from '../../shared/utils/utils'

const LIMIT = 10

function TokenHoldings() {
  const router = useRouter()
  const address = router.query.address || ''

  const {data: addressInfo} = useQuery(
    address && ['balance', address],
    (_, address) => getAddressInfo(address)
  )

  return (
    <Layout title={`Token Holdings ${address}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.org/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">
                <span>Token Holdings</span>
              </h1>
              <h3 className="section_main__subtitle">{address}</h3>
            </div>

            <div className="button-group">
              <Link href="/address/[address]" as={`/address/${address}`}>
                <a className="btn btn-small btn-secondary">
                  <i className="icon icon--coins" />
                  <span>Address details</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Tokens</h3>
        <div className="card">
          <Tokens address={address} addressInfo={addressInfo} />
        </div>
      </section>
    </Layout>
  )
}

function Tokens({address, addressInfo}) {
  const fetchTokens = (_, address, continuationToken = null) =>
    getAddressTokens(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && `${address}/tokens`,
    [address],
    fetchTokens,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Symbol</th>
            <th>Contract address</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && <SkeletonRows cols={4} />}
          {status !== 'loading' &&
          addressInfo &&
          precise6(addressInfo.balance) > 0 ? (
            <tr>
              <td>Idena</td>
              <td>iDNA</td>
              <td>-</td>
              <td>{tokenBalanceFmt(precise6(addressInfo.balance))}</td>
            </tr>
          ) : (
            ''
          )}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.token.contractAddress}>
                  <td>{item.token.name || '-'}</td>
                  <td>{item.token.symbol || '-'}</td>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${item.token.contractAddress.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div className="text_block text_block--ellipsis">
                      <Link
                        href={`/token/[address]?holder=${address}`}
                        as={`/token/${item.token.contractAddress}?holder=${address}`}
                      >
                        <a>{item.token.contractAddress}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{tokenBalanceFmt(precise6(item.balance))}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      <div
        className="text-center"
        style={{display: canFetchMore ? 'block' : 'none'}}
      >
        <button
          type="button"
          className="btn btn-small"
          onClick={() => fetchMore()}
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default TokenHoldings
