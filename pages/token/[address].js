import Link from 'next/link'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {getToken} from '../../shared/api'
import Layout from '../../shared/components/layout'
import {tokenNameFmt} from '../../shared/utils/utils'

function Token() {
  const router = useRouter()
  const address = router.query.address || ''

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
            </div>
          </div>
        </div>
      </section>

      <TokenData tokenInfo={tokenInfo} />
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
                          tokenInfo && tokenInfo.contractAddress
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

export default Token
