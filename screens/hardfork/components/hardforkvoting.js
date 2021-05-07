import {useEffect, useState} from 'react'
import {
  getValidatorsCount,
  getOnlineValidatorsCount,
  getUpgradeVoting,
  getUpgradeData,
} from '../../../shared/api'
import HardForkHistory from './hardforkhistory'
import TooltipText from '../../../shared/components/tooltip'
import {dateTimeFmt} from '../../../shared/utils/utils'

const initialState = {
  online: 0,
  total: 0,
  upgradeVoting: [{upgrade: 0, votes: 0}],
  upgradeData: null,
}

export default function HardForkVoting({upgrade = 5}) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [online, total, upgradeVoting, upgradeData] = await Promise.all([
        getOnlineValidatorsCount(),
        getValidatorsCount(),
        getUpgradeVoting(),
        getUpgradeData(upgrade),
      ])
      setState({
        online,
        total,
        upgradeVoting,
        upgradeData,
      })
    }
    getData()
  }, [upgrade])

  const startDate =
    state &&
    state.upgradeData &&
    new Date(state.upgradeData.startActivationDate)
  const endDate =
    state && state.upgradeData && new Date(state.upgradeData.endActivationDate)
  const now = new Date()
  const status =
    now < startDate ? 'pending' : now < endDate ? 'voting' : 'finished'
  const name =
    status === 'pending' || status === 'voting'
      ? 'Pending hard fork'
      : 'Finished hard fork'

  return (
    <div>
      {state.upgradeData && (
        <>
          <h1>{name}</h1>

          <section className="section section_details">
            <div className="card">
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="section__group">
                    <div className="control-label">Status:</div>
                    <div className="text_block">{status}</div>
                    <hr />
                    <div className="control-label">Consensus version:</div>
                    <div className="text_block">{upgrade}</div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="section__group">
                    <div className="control-label">Start voting:</div>
                    <div className="text_block">{dateTimeFmt(startDate)}</div>
                    <hr />
                    <div className="control-label">Voting deadline:</div>
                    <div className="text_block">{dateTimeFmt(endDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      {status === 'pending' && !state.upgradeVoting && (
        <h3>Voting will start soon...</h3>
      )}

      {state.upgradeVoting &&
        state.upgradeVoting
          .filter((upd) => upd.upgrade === upgrade)
          .map((upd, idx) => {
            const votesRequired = Math.round(
              Math.max(state.online * 0.8, (state.total * 2) / 3)
            )
            const missingVotes = votesRequired - upd.votes

            return (
              <div key={idx}>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <h3>Hard fork activation criteria</h3>

                    <div className="card">
                      <div className="info_block">
                        <div className="row">
                          <div className="col-12 col-sm-6 bordered-col">
                            <h3 className="info_block__accent">
                              <span>
                                {Math.round(state.online * 0.8)} out of{' '}
                                {state.online}
                              </span>
                            </h3>
                            <TooltipText
                              className="control-label"
                              data-toggle="tooltip"
                              tooltip="Requires 80% of online nodes to activate the hard fork (delegated nodes excluded)"
                            >
                              Online nodes required
                            </TooltipText>
                          </div>

                          <div className="col-12 col-sm-6 bordered-col">
                            <h3 className="info_block__accent">
                              <span>
                                {Math.round((state.total / 3) * 2)} out of{' '}
                                {state.total}
                              </span>
                            </h3>
                            <TooltipText
                              className="control-label"
                              data-toggle="tooltip"
                              tooltip="Requires 2/3 of the total number of nodes to activate the hard fork (delegated nodes excluded)"
                            >
                              Total nodes required
                            </TooltipText>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <h3>Votes</h3>
                    <div className="card">
                      <div className="info_block">
                        <div className="row">
                          <div className="col-12 col-sm-6 bordered-col">
                            <h3 className="info_block__accent">
                              <span>
                                {upd.votes} (
                                {votesRequired &&
                                  Math.round((upd.votes / votesRequired) * 100)}
                                %){' '}
                              </span>
                            </h3>
                            <TooltipText
                              className="control-label"
                              data-toggle="tooltip"
                              tooltip="Total number of nodes supporting upcoming changes"
                            >
                              Voted for the fork
                            </TooltipText>
                          </div>

                          <div className="col-12 col-sm-6 bordered-col">
                            <h3 className="info_block__accent">
                              <span>
                                {missingVotes} (
                                {votesRequired &&
                                  Math.round(
                                    (missingVotes / votesRequired) * 100
                                  )}
                                %)
                              </span>
                            </h3>
                            <TooltipText
                              className="control-label"
                              data-toggle="tooltip"
                              tooltip="Missing votes to activate the hard fork"
                            >
                              Missing votes
                            </TooltipText>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                {upd.upgrade && (
                  <div key={upd.upgrade}>
                    <br />
                    <h3>Voting progress</h3>
                    <HardForkHistory
                      upgrade={upd.upgrade}
                      votesRequired={votesRequired}
                    />
                    <br />
                  </div>
                )}
              </div>
            )
          })}
    </div>
  )
}
