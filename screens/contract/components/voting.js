import Link from 'next/link'
import {useQuery} from 'react-query'
import {getOracleVotingContract} from '../../../shared/api'

export default function VotingData({address}) {
  const {data: votingInfo} = useQuery(
    address && ['voting', address],
    (_, address) => getOracleVotingContract(address)
  )

  const fact = votingInfo && hexToObject(votingInfo.fact)

  return (
    <>
      <section className="section section_details">
        <h3>Voting details</h3>
        <div className="card">
          <div className="section__group">
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="control-label">State:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.state) || '-'}
                </div>
                <hr />
              </div>
              <div className="col-12 col-sm-12">
                <div className="control-label">Title:</div>
                <div className="text_block">{(fact && fact.title) || '-'}</div>
                <hr />
                <div className="control-label">Description:</div>
                <div className="text_block">{(fact && fact.desc) || '-'}</div>
                <hr />
              </div>
              <div className="col-12 col-sm-3">
                <div className="control-label">Committee size:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.committeeSize) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-3">
                <div className="control-label">Quorum required:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.quorum) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-3">
                <div className="control-label">Secret votes:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.voteProofsCount) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-3">
                <div className="control-label">Votes:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.votesCount) || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12">
            <h3>Voting options</h3>
            <div className="card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{width: 300}}>Option</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fact &&
                      fact.options &&
                      fact.options.map((item) => (
                        <tr>
                          <td>{item.value}</td>
                          <td>
                            {optionVotes(item.id, votingInfo.votes) || '-'}
                          </td>
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

function hexToObject(hex) {
  try {
    return JSON.parse(
      new TextDecoder().decode(Buffer.from(hex.substring(2), 'hex'))
    )
  } catch {
    return {}
  }
}

function optionVotes(option, votes) {
  if (!votes) {
    return 0
  }
  const item = votes.find((x) => x.option === option)
  if (!item) {
    return 0
  }
  return item.count
}
