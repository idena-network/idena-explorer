import {useQuery} from 'react-query'
import Link from 'next/link'
import {getMultisigContract} from '../../../shared/api'
import {dnaFmt, precise6} from '../../../shared/utils/utils'

export default function MultisigData({address}) {
  const {data: multisigInfo} = useQuery(
    address && ['multisig', address],
    (_, address) => getMultisigContract(address)
  )

  return (
    <>
      <section className="section section_details">
        <h3>Multisig details</h3>
        <div className="card">
          <div className="section__group">
            <div className="row">
              <div className="col-12 col-sm-4">
                <div className="control-label">Total voters:</div>
                <div className="text_block">
                  {(multisigInfo && multisigInfo.maxVotes) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Required votes:</div>
                <div className="text_block">
                  {(multisigInfo && multisigInfo.minVotes) || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12">
            <h3>Voters</h3>
            <div className="card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Voter address</th>
                      <th>Vote for destination address</th>
                      <th>Vote for amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multisigInfo &&
                      multisigInfo.signers &&
                      multisigInfo.signers.map((item) => (
                        <tr key={item.address}>
                          <td>
                            <div className="user-pic">
                              <img
                                src={`https://robohash.org/${item.address.toLowerCase()}`}
                                alt="pic"
                                width="32"
                              />
                            </div>
                            <div
                              className="text_block text_block--ellipsis"
                              style={{width: 300}}
                            >
                              <Link
                                href="/address/[address]"
                                as={`/address/${item.address}`}
                              >
                                <a>{item.address}</a>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="user-pic">
                              <img
                                src={`https://robohash.org/${item.destAddress.toLowerCase()}`}
                                alt="pic"
                                width="32"
                              />
                            </div>
                            <div
                              className="text_block text_block--ellipsis"
                              style={{width: 300}}
                            >
                              <Link
                                href="/address/[address]"
                                as={`/address/${item.destAddress}`}
                              >
                                <a>{item.destAddress}</a>
                              </Link>
                            </div>
                          </td>
                          <td>{dnaFmt(precise6(item.amount), '')}</td>
                        </tr>
                      ))}
                    {multisigInfo &&
                      [
                        ...Array(
                          (multisigInfo.maxVotes || 0) -
                            ((multisigInfo.signers &&
                              multisigInfo.signers.length) ||
                              0)
                        ).keys(),
                      ].map((_, idx) => (
                        <tr key={idx}>
                          <td>Not specified</td>
                          <td />
                          <td />
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
