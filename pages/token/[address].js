import Link from 'next/link'
import {useRouter} from 'next/router'
import {useInfiniteQuery, useQuery} from 'react-query'
import {getAddressToken, getToken, getTokenHolders} from '../../shared/api'
import Layout from '../../shared/components/layout'
import {precise6, tokenBalanceFmt, tokenNameFmt} from '../../shared/utils/utils'
import {SkeletonRows} from '../../shared/components/skeleton'

function Token() {
  const router = useRouter()
  const address = router.query.address || ''
  const holder = router.query.holder || ''

  const {data: tokenInfo} = useQuery(
    address && ['token', address],
    (_, address) => getToken(address)
  )

  return (
    <Layout title={`Token ${tokenNameFmt(tokenInfo)}`}>
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
                <span>Token</span>
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

              <Link href="/contract/[address]" as={`/contract/${address}`}>
                <a className="btn btn-small btn-secondary">
                  <span>Contract details</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TokenData tokenInfo={tokenInfo} />
      {holder && <HolderData address={holder} tokenAddress={address} />}
      {!holder && <HoldersData address={address} tokenAddress={address} />}
    </Layout>
  )
}

function TokenData({tokenInfo}) {
  return (
    <section className="section section_details">
      <h3>Details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Contract:</div>
              {(tokenInfo && (
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: '80%'}}
                >
                  <Link
                    href="/contract/[address]"
                    as={`/contract/${tokenInfo && tokenInfo.contractAddress}`}
                  >
                    <a>
                      <img
                        alt="user-pic"
                        className="user-pic"
                        width="32"
                        src={`https://robohash.idena.io/${
                          tokenInfo && tokenInfo.contractAddress.toLowerCase()
                        }`}
                      />
                      <span>{tokenInfo && tokenInfo.contractAddress}</span>
                    </a>
                  </Link>
                </div>
              )) ||
                '-'}
              <hr />
              <div className="control-label">Name:</div>
              <div className="text_block">
                {(tokenInfo && tokenInfo.name) || '-'}
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Decimals:</div>
              <div className="text_block">
                {(tokenInfo && tokenInfo.decimals) || 0}
              </div>
              <hr />
              <div className="control-label">Symbol:</div>
              <div className="text_block">
                {(tokenInfo && tokenInfo.symbol) || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HolderData({address, tokenAddress}) {
  const {data: holderInfo} = useQuery(
    address && tokenAddress && ['tokenHolder', address, tokenAddress],
    (_, address) => getAddressToken(address, tokenAddress)
  )

  return (
    <section className="section section_details">
      <h3>Holder details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Address:</div>

              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                <Link href="/address/[address]" as={`/address/${address}`}>
                  <a>
                    <img
                      alt="user-pic"
                      className="user-pic"
                      width="32"
                      src={`https://robohash.idena.io/${address.toLowerCase()}`}
                    />
                    <span>{address}</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Balance:</div>
              <div className="text_block">
                {(holderInfo &&
                  tokenBalanceFmt(precise6(holderInfo.balance))) ||
                  '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HoldersData({address, tokenAddress}) {
  const LIMIT = 10
  const fetchHolders = (_, address, continuationToken = null) =>
    getTokenHolders(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && `${address}/tokenHolders`,
    [address],
    fetchHolders,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  return (
    <section className="section">
      <h3>Holders</h3>
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && <SkeletonRows cols={2} />}
              {data.map(
                (page) =>
                  page &&
                  page.map((item) => (
                    <tr key={item.address}>
                      <td>
                        <div className="user-pic">
                          <img
                            src={`https://robohash.idena.io/${item.address.toLowerCase()}`}
                            alt="pic"
                            width="32"
                          />
                        </div>
                        <div className="text_block text_block--ellipsis">
                          <Link
                            href={`/token/[address]?holder=${item.address}`}
                            as={`/token/${tokenAddress}?holder=${item.address}`}
                          >
                            <a>{item.address}</a>
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
      </div>
    </section>
  )
}

export default Token
