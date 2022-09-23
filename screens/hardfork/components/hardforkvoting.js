import {useEffect, useState} from 'react'
import {
  getUpgradeVoting,
  getUpgradeData,
  getUpgrades,
  getForkCommitteeCount,
  getHardForkVotingHistory,
} from '../../../shared/api'
import HardForkHistory from './hardforkhistory'
import TooltipText from '../../../shared/components/tooltip'
import {dateTimeFmt} from '../../../shared/utils/utils'

const initialState = {
  online: 0,
  upgradeVoting: [{upgrade: 9, votes: 1}],
  upgradeData: null,
  upgrades: null,
  votingHistory: null,
}

export default function HardForkVoting({upgrade = 9}) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function getData() {
      const [
        online,
        upgradeVoting,
        upgradeData,
        upgrades,
        votingHistory,
      ] = await Promise.all([
        getForkCommitteeCount(),
        getUpgradeVoting(),
        getUpgradeData(upgrade),
        getUpgrades(1),
        getHardForkVotingHistory(upgrade),
      ])
      setState({
        online,
        upgradeVoting,
        upgradeData,
        upgrades,
        votingHistory,
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
    now < startDate
      ? 'Pending'
      : upgrade <=
        ((state &&
          state.upgrades &&
          state.upgrades.length &&
          state.upgrades[0].upgrade) ||
          0)
      ? 'Activated'
      : now < endDate
      ? 'Voting'
      : 'Finished'

  const upd =
    state.upgradeVoting &&
    state.upgradeVoting.filter((u) => u.upgrade === upgrade)

  const votes = upd && upd.length > 0 && upd[0] ? upd[0].votes : null

  const votesRequired = votes ? Math.round(state.online * 0.8) : null
  const missingVotes =
    status === 'Activated' ? 0 : Math.max(votesRequired - votes, 0)
  return (
    <div>
      {state.upgradeData && (
        <>
          <h1>{`Hard fork #${upgrade}: ${status.toLowerCase()}`}</h1>

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

                    <div className="control-label" data-toggle="tooltip">
                      <TooltipText tooltip="The date on which the voting will be stopped if the fork activation criteria are not met">
                        Voting deadline:
                      </TooltipText>
                    </div>

                    <div className="text_block">{dateTimeFmt(endDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      {status === 'Pending' && !state.upgradeVoting && (
        <h3>Voting will start soon...</h3>
      )}

      {votes && (
        <div>
          <div className="row">
            <div className="col-12 col-sm-12">
              <h3>Hard fork activation criteria</h3>
              <ul>
                <p className="text_block">
                  1. Only Idena validators with <b>activated mining status</b>{' '}
                  vote. Running the new node version means that the validator
                  supports the upcoming changes.
                </p>
                <p className="text_block">
                  2. Newbies and delegated identities can not vote. Pool owners
                  are counted once.
                </p>
                <p className="text_block">
                  3. The hard fork update will be activated only when more than
                  80% of {state.online} validators support the upcoming changes:{' '}
                  <b>{Math.round(state.online * 0.8)} votes required</b>.
                </p>
              </ul>
            </div>

            <div className="col-12 col-sm-12">
              <h3>Votes</h3>
              <div className="card">
                <div className="info_block">
                  <div className="row">
                    <div className="col-12 col-sm-6 bordered-col">
                      <h3 className="info_block__accent">
                        <span>{votes ? `${votes}` : status}</span>
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
                        <span>{missingVotes ? `${missingVotes}` : '-'}</span>
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
        </div>
      )}
      <div>
        <br />
        {state && state.votingHistory && state.votingHistory.length && (
          <>
            <h3>Voting progress</h3>
            <p className="text_block">
              Nodes with activated mining status supporting the fork
            </p>
            <HardForkHistory
              votesRequired={votesRequired}
              votingHistory={state.votingHistory}
            />
            <br />
          </>
        )}
      </div>
    </div>
  )
}
