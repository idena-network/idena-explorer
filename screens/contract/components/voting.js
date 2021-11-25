import getUrls from 'get-urls'
import {useQuery} from 'react-query'
import {getOracleVotingContract} from '../../../shared/api'
import {dnaFmt, hexToObject} from '../../../shared/utils/utils'

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
                <div
                  className="text_block text_block--ellipsis"
                  style={{whiteSpace: 'pre-line', width: '100%'}}
                >
                  {fact ? <Linkify>{fact.desc}</Linkify> : '-'}
                </div>
                <hr />
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Committee size:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.committeeSize) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Quorum required:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.quorum) || '-'}%
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Votes required:</div>
                <div className="text_block">
                  {(votingInfo &&
                    votingInfo.committeeSize &&
                    votingInfo.quorum &&
                    Math.floor(
                      (votingInfo.committeeSize * votingInfo.quorum) / 100
                    )) ||
                    '-'}
                </div>
              </div>
              <div className="col-12">
                <hr />
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Majority threshold:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.winnerThreshold) || '-'}%
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Voting deposit:</div>
                <div className="text_block">
                  {votingInfo && dnaFmt(votingInfo.minPayment, '')} iDNA
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Owner fee:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.ownerFee) || '-'}%
                </div>
              </div>
              <div className="col-12">
                <hr />
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Total votes:</div>
                <div className="text_block">
                  {(votingInfo &&
                    (votingInfo.secretVotesCount || 0) +
                      (votingInfo.votesCount || 0)) ||
                    '-'}
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Secret votes:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.secretVotesCount) || '-'}
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="control-label">Votes published:</div>
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
                        <tr key={item.id}>
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

export function Linkify({children}) {
  if (!children) return null

  if (typeof children !== 'string') throw new Error('Only text nodes supported')

  const urls = getUrls(children, {stripWWW: false})
  const parts = urls.size > 0 ? splitMany(children, ...urls) : [children]

  return (
    <>
      {parts.map((part) =>
        part.startsWith('http') ? <a href={part}>{part}</a> : <>{part}</>
      )}
    </>
  )
}

function splitMany(str, ...separators) {
  const acc = []
  let nextStr = str

  for (const s of separators) {
    const [s1, s2] = nextStr.split(s)
    acc.push(s1, s)
    nextStr = s2
  }

  acc.push(nextStr)

  return acc
}
