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
  upgradeVoting: [{upgrade: 8, votes: 1}],
  upgradeData: null,
}

export default function HardForkVoting({
  upgrade = 8,
  lastActivatedUpgrade = 5,
}) {
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
    now < startDate
      ? 'Pending'
      : upgrade === lastActivatedUpgrade
      ? 'Activated'
      : now < endDate
      ? 'Voting'
      : 'Finished'

  const upd =
    state.upgradeVoting &&
    state.upgradeVoting.filter((u) => u.upgrade === upgrade)

  const votes = upd && upd.length > 0 && upd[0] ? upd[0].votes : null

  const votesRequired = votes
    ? Math.round(Math.max(state.online * 0.8, state.total * 0.6))
    : null
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
                      <TooltipText tooltip="The date on which the voting will be stopped if the fork activation critera are not met">
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
                  1. Only addresses with <b>activated mining status</b> can
                  vote. Delegated addresses are excluded.
                </p>
                <p className="text_block">
                  2. Running the new version of the node means that the address
                  is voting for the upcoming protocol changes.
                </p>
                <p className="text_block">
                  3. The hard fork update will be activated only when both of
                  the voting criteria are met:
                </p>
                <p className="text_block">
                  - more than 80% of all {state.online} addresses with activated
                  mining status support the upcoming changes:{' '}
                  <b>{Math.round(state.online * 0.8)} required votes</b>
                </p>
                <p className="text_block">
                  - more than 60% of all {state.total} possible validators
                  support the upcoming changes:{' '}
                  <b>{Math.round(state.total * 0.6)} required votes</b>
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
        <h3>Voting progress</h3>
        <p className="text_block">
          Nodes with activated mining status supporting the fork
        </p>
        <HardForkHistory upgrade={upgrade} votesRequired={votesRequired} />
        <br />
      </div>
    </div>
  )
}
