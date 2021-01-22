import {useEffect, useState} from 'react'
import {
  getOnlineMinersCount,
  getOnlineIdentitiesCount,
  getUpgradeVoting,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

const initialState = {
  online: 0,
  total: 0,
  upgradeVoting: [{upgrade: 0, votes: 0}],
}

export default function HardForkVoting() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [online, total, upgradeVoting] = await Promise.all([
        getOnlineMinersCount(),
        getOnlineIdentitiesCount(),
        getUpgradeVoting(),
      ])
      setState({
        online,
        total,
        upgradeVoting,
      })
    }
    getData()
  }, [])

  return (
    <div>
      {(!state.upgradeVoting || state.upgradeVoting.length === 0) && (
        <h1>No pending hard forks found</h1>
      )}
      {state.upgradeVoting &&
        state.upgradeVoting.map((upd, idx) => {
          const votesRequired = Math.round(
            Math.max(state.online * 0.8, (state.total * 2) / 3)
          )
          const missingVotes = votesRequired - upd.votes

          return (
            <div className="row" key={idx}>
              <div className="col-12 col-sm-6">
                <h1>Hard fork voting</h1>
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
                              Math.round((missingVotes / votesRequired) * 100)}
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

              <div className="col-12 col-sm-6">
                <h1>Hard fork activation criteria</h1>

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
                          tooltip="Requires 80% of online nodes to activate the hard fork"
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
                          tooltip="Requires 2/3 of the total number of nodes to activate the hard fork"
                        >
                          Total nodes required
                        </TooltipText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
