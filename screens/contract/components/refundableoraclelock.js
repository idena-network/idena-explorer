import {useQuery} from 'react-query'
import Link from 'next/link'
import {
  getRefundableOracleLockContract,
  getOracleVotingContract,
} from '../../../shared/api'
import {dateTimeFmt, hexToObject} from '../../../shared/utils/utils'

export default function RefundableOracleLockData({address}) {
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const {data: refundableOracleLockInfo} = useQuery(
    address && ['refundableOracleLock', address],
    (_, address) => getRefundableOracleLockContract(address)
  )

  const {data: oracleVotingInfo} = useQuery(
    refundableOracleLockInfo && [
      'oracleVoting',
      refundableOracleLockInfo.oracleVotingAddress,
    ],
    (_, address) => getOracleVotingContract(address)
  )

  const fact = oracleVotingInfo && hexToObject(oracleVotingInfo.fact)
  const option =
    fact &&
    fact.options &&
    fact.options.find((item) => item.id === refundableOracleLockInfo.value)

  return (
    <section className="section section_details">
      <h3>RefundableOracleLock details</h3>
      <div className="card">
        <div className="section__group">
          <div className="row">
            <div className="col">
              <div className="control-label">Oracle voting:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '75%'}}
              >
                {refundableOracleLockInfo && (
                  <Link
                    href={
                      oracleVotingInfo
                        ? '/contract/[address]'
                        : '/address/[address]'
                    }
                    as={
                      oracleVotingInfo
                        ? `/contract/${refundableOracleLockInfo.oracleVotingAddress}`
                        : `/address/${refundableOracleLockInfo.oracleVotingAddress}`
                    }
                  >
                    <a>
                      <img
                        alt="user-pic"
                        className="user-pic"
                        width="32"
                        src={`https://robohash.idena.io/${refundableOracleLockInfo.oracleVotingAddress.toLowerCase()}`}
                      />
                      <span>
                        {refundableOracleLockInfo.oracleVotingAddress}
                      </span>
                    </a>
                  </Link>
                )}
              </div>
            </div>
            {oracleVotingInfo && (
              <div className="col">
                <div className="text_block">
                  <span>{fact && fact.title}</span>
                </div>
              </div>
            )}
          </div>
          <hr />

          {oracleVotingInfo && (
            <>
              <div className="row">
                <div className="col">
                  <div className="control-label">Unlock condition:</div>
                  <div className="text_block">
                    [
                    {refundableOracleLockInfo && refundableOracleLockInfo.value}
                    ] {option && option.value}
                  </div>
                </div>
              </div>
              <hr />
            </>
          )}
          <div className="row">
            <div className="col">
              <div className="control-label">Success address:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {refundableOracleLockInfo &&
                  refundableOracleLockInfo.successAddress !== zeroAddress && (
                    <Link
                      href="/address/[address]"
                      as={`/address/${refundableOracleLockInfo.successAddress}`}
                    >
                      <a>
                        <img
                          alt="user-pic"
                          className="user-pic"
                          width="32"
                          src={`https://robohash.idena.io/${refundableOracleLockInfo.successAddress.toLowerCase()}`}
                        />
                        <span>{refundableOracleLockInfo.successAddress}</span>
                      </a>
                    </Link>
                  )}
                {refundableOracleLockInfo &&
                  refundableOracleLockInfo.successAddress === zeroAddress && (
                    <span>none (refund deposits)</span>
                  )}
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <div className="control-label">Fail address:</div>
              <div
                className="text_block text_block--ellipsis"
                style={{width: '80%'}}
              >
                {refundableOracleLockInfo &&
                  refundableOracleLockInfo.failAddress !== zeroAddress && (
                    <Link
                      href="/address/[address]"
                      as={`/address/${refundableOracleLockInfo.failAddress}`}
                    >
                      <a>
                        <img
                          alt="user-pic"
                          className="user-pic"
                          width="32"
                          src={`https://robohash.idena.io/${refundableOracleLockInfo.failAddress.toLowerCase()}`}
                        />
                        <span>{refundableOracleLockInfo.failAddress}</span>
                      </a>
                    </Link>
                  )}
                {refundableOracleLockInfo &&
                  refundableOracleLockInfo.failAddress === zeroAddress && (
                    <span>none (refund deposits)</span>
                  )}
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <div className="control-label">Deposit deadline:</div>
              <div className="text_block">
                {refundableOracleLockInfo &&
                refundableOracleLockInfo.depositDeadline
                  ? dateTimeFmt(refundableOracleLockInfo.depositDeadline)
                  : '-'}
              </div>
            </div>
            <div className="col">
              <div className="control-label">Oracle voting fee:</div>
              <div className="text_block">
                {refundableOracleLockInfo
                  ? `${refundableOracleLockInfo.oracleVotingFee} %`
                  : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
