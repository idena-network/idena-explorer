import {useQuery} from 'react-query'
import Link from 'next/link'
import {
  getOracleLockContract,
  getOracleVotingContract,
} from '../../../shared/api'
import {hexToObject} from '../../../shared/utils/utils'

export default function OracleLockData({address}) {
  const {data: oracleLockInfo} = useQuery(
    address && ['oracleLock', address],
    (_, address) => getOracleLockContract(address)
  )

  const {data: oracleVotingInfo} = useQuery(
    oracleLockInfo && ['oracleVoting', oracleLockInfo.oracleVotingAddress],
    (_, address) => getOracleVotingContract(address)
  )

  const fact = oracleVotingInfo && hexToObject(oracleVotingInfo.fact)
  const option =
    fact &&
    fact.options &&
    fact.options.find((item) => item.id === oracleLockInfo.value)

  return (
    <section className="section section_details">
      <h3>OracleLock details</h3>
      <div className="card">
        <div className="section__group">
          <div className="row">
            <div
              className={
                oracleVotingInfo ? `col-12 col-sm-6` : `col-12 col-sm-12`
              }
            >
              <div className="control-label">Oracle voting:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '75%'}}
              >
                {oracleLockInfo && (
                  <Link
                    href={
                      oracleVotingInfo
                        ? '/contract/[address]'
                        : '/address/[address]'
                    }
                    as={
                      oracleVotingInfo
                        ? `/contract/${oracleLockInfo.oracleVotingAddress}`
                        : `/address/${oracleLockInfo.oracleVotingAddress}`
                    }
                  >
                    <a>
                      <img
                        alt="user-pic"
                        className="user-pic"
                        width="32"
                        src={`https://robohash.idena.io/${oracleLockInfo.oracleVotingAddress.toLowerCase()}`}
                      />
                      <span>{oracleLockInfo.oracleVotingAddress}</span>
                    </a>
                  </Link>
                )}
              </div>
            </div>
            {oracleVotingInfo && (
              <div className="col-12 col-sm-6">
                <div className="text_block">
                  <span>{fact && fact.title}</span>
                </div>
              </div>
            )}
            <div className="col-12 col-sm-12">
              <hr />
            </div>
            {oracleVotingInfo && (
              <div className="col-12 col-sm-12">
                <div className="control-label">Unlock condition:</div>
                <div className="text_block">
                  [{oracleLockInfo && oracleLockInfo.value}]{' '}
                  {option && option.value}
                </div>
                <hr />
              </div>
            )}
            <div className="col-12 col-sm-12">
              <div className="control-label">Success address:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {oracleLockInfo && (
                  <Link
                    href="/address/[address]"
                    as={`/address/${oracleLockInfo.successAddress}`}
                  >
                    <a>
                      <img
                        alt="user-pic"
                        className="user-pic"
                        width="32"
                        src={`https://robohash.idena.io/${oracleLockInfo.successAddress.toLowerCase()}`}
                      />
                      <span>{oracleLockInfo.successAddress}</span>
                    </a>
                  </Link>
                )}
              </div>
              <hr />
            </div>
            <div className="col-12 col-sm-12">
              <div className="control-label">Fail address:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {oracleLockInfo && (
                  <Link
                    href="/address/[address]"
                    as={`/address/${oracleLockInfo.failAddress}`}
                  >
                    <a>
                      <img
                        alt="user-pic"
                        className="user-pic"
                        width="32"
                        src={`https://robohash.idena.io/${oracleLockInfo.failAddress.toLowerCase()}`}
                      />
                      <span>{oracleLockInfo.failAddress}</span>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
