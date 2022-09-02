import {useQuery} from 'react-query'
import urlRegex from 'url-regex-safe'
import Link from 'next/link'
import {getOracleVotingContract} from '../../../shared/api'
import {dnaFmt, hexToObject} from '../../../shared/utils/utils'

export default function VotingData({address}) {
  const {data: votingInfo} = useQuery(
    address && ['voting', address],
    (_, address) => getOracleVotingContract(address)
  )

  const fact = votingInfo && hexToObject(votingInfo.fact)
  const publishedVotes = (votingInfo && votingInfo.votesCount) || 0
  const countedVotes =
    (fact &&
      fact.options &&
      fact.options.reduce(
        (result, entry) => result + optionVotes(entry.id, votingInfo.votes),
        0
      )) ||
    0
  const ignoredVotes = (publishedVotes || 0) - (countedVotes || 0)

  const ownerAddress =
    (votingInfo && (votingInfo.refundRecipient || votingInfo.author)) || ''

  const oracleTotalReward =
    (votingInfo &&
      (votingInfo.totalReward || votingInfo.estimatedTotalReward)) ||
    0

  return (
    <>
      <section className="section section_details">
        <h3>Voting details</h3>
        <div className="card">
          <div className="section__group">
            <div className="row">
              <div className="col-12 col-sm-12" style={{paddingBottom: 0}}>
                <div className="control-label">State:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.state) || '-'}
                </div>
                <hr />
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
              <div className="col-12 col-sm-4" style={{paddingTop: 0}}>
                <div className="control-label">Committee size:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.committeeSize) || '-'}
                </div>
                <hr />
                <div className="control-label">Majority threshold:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.winnerThreshold) || '-'}%
                </div>
                <hr />
                {votingInfo && votingInfo.ownerDeposit && (
                  <>
                    <div className="control-label">Owner deposit:</div>
                    <div className="text_block">
                      {votingInfo && dnaFmt(votingInfo.ownerDeposit)}
                    </div>
                    <hr />
                  </>
                )}
                <div className="control-label">Total votes:</div>
                <div className="text_block">
                  {(votingInfo &&
                    (votingInfo.secretVotesCount || 0) +
                      (votingInfo.votesCount || 0)) ||
                    '-'}
                </div>
                <hr />
                <div className="control-label">Counted votes:</div>
                <div className="text_block">{countedVotes || '-'}</div>
              </div>
              <div className="col-12 col-sm-4" style={{paddingTop: 0}}>
                <div className="control-label">Quorum required:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.quorum) || '-'}%
                </div>
                <hr />
                <div className="control-label">Voting deposit:</div>
                <div className="text_block">
                  {votingInfo && dnaFmt(votingInfo.minPayment, '')} iDNA
                </div>
                <hr />
                {votingInfo && votingInfo.ownerDeposit && (
                  <>
                    <div className="control-label">Owner address:</div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 190}}
                    >
                      <Link
                        href="/address/[address]"
                        as={`/address/${ownerAddress}`}
                      >
                        <a>
                          <img
                            alt="user-pic"
                            className="user-pic"
                            width="32"
                            src={`https://robohash.idena.io/${ownerAddress.toLowerCase()}`}
                          />
                          <span>{ownerAddress}</span>
                        </a>
                      </Link>
                    </div>
                    <hr />
                  </>
                )}
                <div className="control-label">Secret votes:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.secretVotesCount) || '-'}
                </div>
                <hr />
                <div className="control-label">Ignored votes (pools):</div>
                <div className="text_block">{ignoredVotes || '-'}</div>
              </div>
              <div className="col-12 col-sm-4" style={{paddingTop: 0}}>
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
                <hr />
                <div className="control-label">Owner fee:</div>
                <div className="text_block">
                  {(votingInfo && votingInfo.ownerFee) || '-'}%
                </div>
                <hr />
                {votingInfo && votingInfo.ownerDeposit && (
                  <>
                    <div className="control-label">Oracles rewards:</div>
                    <div className="text_block">
                      {votingInfo && dnaFmt(oracleTotalReward)}
                    </div>
                    <hr />
                  </>
                )}
                <div className="control-label">Votes published:</div>
                <div className="text_block">{publishedVotes || '-'}</div>
                <hr />
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

  const urls = getUrls(children)
  const parts = urls.length > 0 ? splitMany(children, ...urls) : [children]

  return (
    <>
      {parts.map((part) =>
        part.startsWith('http') ? <a href={part}>{part}</a> : <>{part}</>
      )}
    </>
  )
}

function getUrls(text) {
  return text.match(urlRegex()) || []
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
