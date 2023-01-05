import Link from 'next/link'
import {useRouter} from 'next/router'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {NavItem} from 'reactstrap'
import NavLink from 'reactstrap/lib/NavLink'
import Layout from '../../../../../../shared/components/layout'
import {
  getDelegateeRewardsByAddress,
  getEpochDelegateeTotalReward,
  getEpochRewardsSummary,
} from '../../../../../../shared/api'
import {
  epochFmt,
  dnaFmt,
  precise6,
  identityStatusFmt,
} from '../../../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../../../shared/components/skeleton'
import TooltipText from '../../../../../../shared/components/tooltip'

const LIMIT = 30

function Rewards() {
  const router = useRouter()
  const address = router.query.address || ''
  const epoch = parseInt(router.query.epoch || 0)

  const {data: totalRewards} = useQuery(
    address && epoch && ['epoch/totalRewards', address, epoch - 1],
    (_, address, epoch) => getEpochDelegateeTotalReward(address, epoch)
  )

  const {data: rewardsSummary} = useQuery(
    epoch && epoch - 1 >= 0 && ['epoch/rewardsSummary', epoch - 1],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )
  const validation =
    rewardsSummary && rewardsSummary.validation && rewardsSummary.validation > 0
  const staking =
    rewardsSummary && rewardsSummary.staking && rewardsSummary.staking > 0

  const fetchRewards = (_, address, epoch, continuationToken = null) =>
    getDelegateeRewardsByAddress(address, epoch, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && epoch && [`epoch/delegateeRewards`, address, epoch - 1],
    fetchRewards,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const getReward = (arr, type) => {
    if (!arr) {
      return 0
    }
    const item = arr.find((x) => x.type === type)
    if (!item) {
      return 0
    }
    return item.balance * 1
  }

  const validationReward =
    (totalRewards && getReward(totalRewards.rewards, 'Validation')) || 0
  const stakingReward =
    (totalRewards && getReward(totalRewards.rewards, 'Staking')) || 0
  const candidateReward =
    (totalRewards && getReward(totalRewards.rewards, 'Candidate')) || 0
  const invitationsReward =
    (totalRewards &&
      getReward(totalRewards.rewards, 'Invitations') +
        getReward(totalRewards.rewards, 'Invitations2') +
        getReward(totalRewards.rewards, 'Invitations3') +
        getReward(totalRewards.rewards, 'SavedInvite') +
        getReward(totalRewards.rewards, 'SavedInviteWin') +
        getReward(totalRewards.rewards, 'Invitee') +
        getReward(totalRewards.rewards, 'Invitee2') +
        getReward(totalRewards.rewards, 'Invitee3')) ||
    0

  const flipsReward =
    (totalRewards &&
      getReward(totalRewards.rewards, 'Flips') +
        getReward(totalRewards.rewards, 'ExtraFlips')) ||
    0

  const reportsReward =
    (totalRewards && getReward(totalRewards.rewards, 'Reports')) || 0

  return (
    <Layout title={`Pool rewards ${address} for epoch ${epochFmt(epoch)}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.idena.io/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">
                <span>Pool rewards for epoch </span>
                <span>{epochFmt(epoch)}</span>
              </h1>
              <h3 className="section_main__subtitle">{address}</h3>
            </div>
            <div className="button-group">
              <Link href="/address/[address]" as={`/address/${address}`}>
                <a className="btn btn-small btn-secondary">
                  <i className="icon icon--coins" />
                  <span>Address details</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Pool:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: '80%'}}
                >
                  <Link
                    href="/pool/[address]#rewards"
                    as={`/pool/${address}#rewards`}
                  >
                    <a>{address}</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">
                  Validation rewards for epoch:
                </div>
                <div className="text_block">
                  <Link
                    href="/epoch/[epoch]/rewards"
                    as={`/epoch/${epoch}/rewards`}
                  >
                    <a>{epochFmt(epoch)}</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className={`col-12 col-sm-${validation ? 4 : 3}`}>
            <h3>Total reward, iDNA</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-12 bordered-col">
                    <h3 className="info_block__accent">
                      <span>
                        {dnaFmt(
                          validationReward +
                            flipsReward +
                            invitationsReward +
                            stakingReward +
                            candidateReward,
                          ''
                        )}
                      </span>
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Total reward paid"
                    >
                      Total
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`col-12 col-sm-${validation ? 8 : 9}`}>
            <h3>Rewards paid, iDNA </h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  {validation && (
                    <div className="bordered-col col">
                      <h3 className="info_block__accent">
                        {dnaFmt(validationReward, '')}
                      </h3>
                      <TooltipText
                        className="control-label"
                        data-toggle="tooltip"
                        tooltip="Reward for successful validation"
                      >
                        Validation
                      </TooltipText>
                    </div>
                  )}
                  {staking && (
                    <>
                      <div className="bordered-col col">
                        <h3 className="info_block__accent">
                          {dnaFmt(stakingReward, '')}
                        </h3>
                        <TooltipText
                          className="control-label"
                          data-toggle="tooltip"
                          tooltip="Quadratic staking reward"
                        >
                          Staking
                        </TooltipText>
                      </div>
                      <div className="bordered-col col">
                        <h3 className="info_block__accent">
                          {dnaFmt(candidateReward, '')}
                        </h3>
                        <TooltipText
                          className="control-label"
                          data-toggle="tooltip"
                          tooltip="Reward for the first successful validation"
                        >
                          Candidate
                        </TooltipText>
                      </div>
                    </>
                  )}
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {dnaFmt(flipsReward, '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Reward for qualified flips"
                    >
                      Flips
                    </TooltipText>
                  </div>
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {dnaFmt(invitationsReward, '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Reward for validated invitations"
                    >
                      Invitations
                    </TooltipText>
                  </div>
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {dnaFmt(reportsReward, '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Reward for reports"
                    >
                      Reports
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink active>
                      <h3>Delegator's rewards</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>
                      Previous <br />
                      status
                    </th>
                    <th>Status</th>
                    {validation && (
                      <th style={{width: 80}}>
                        Validation
                        <br />
                        reward,
                        <br />
                        iDNA
                      </th>
                    )}
                    {staking && (
                      <>
                        <th style={{width: 80}}>
                          Staking
                          <br />
                          reward,
                          <br />
                          iDNA
                        </th>
                        <th style={{width: 80}}>
                          Candidate
                          <br />
                          reward,
                          <br />
                          iDNA
                        </th>
                      </>
                    )}
                    <th style={{width: 80}}>
                      Flip
                      <br />
                      rewards,
                      <br />
                      iDNA
                    </th>
                    <th style={{width: 80}}>
                      Invitation
                      <br />
                      rewards,
                      <br />
                      iDNA
                    </th>
                    <th style={{width: 80}}>
                      Report
                      <br />
                      rewards,
                      <br />
                      iDNA
                    </th>
                    <th style={{width: 80}}>
                      Total
                      <br />
                      reward,
                      <br />
                      iDNA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {status === 'loading' && (
                    <SkeletonRows cols={validation ? 8 : staking ? 9 : 7} />
                  )}
                  {data &&
                    data.map((page, i) => (
                      <Fragment key={i}>
                        {page &&
                          page.map((item) => {
                            const validationReward = getReward(
                              item.rewards,
                              'Validation'
                            )
                            const stakingReward = getReward(
                              item.rewards,
                              'Staking'
                            )
                            const candidateReward = getReward(
                              item.rewards,
                              'Candidate'
                            )
                            const invitaionReward =
                              getReward(item.rewards, 'Invitations') +
                              getReward(item.rewards, 'Invitations2') +
                              getReward(item.rewards, 'Invitations3') +
                              getReward(item.rewards, 'Invitee') +
                              getReward(item.rewards, 'Invitee2') +
                              getReward(item.rewards, 'Invitee3')

                            const flipsReward =
                              getReward(item.rewards, 'Flips') +
                              getReward(item.rewards, 'ExtraFlips')

                            const reportsReward = getReward(
                              item.rewards,
                              'Reports'
                            )

                            return (
                              <tr key={item.delegatorAddress}>
                                <td>
                                  <div className="user-pic">
                                    <img
                                      src={`https://robohash.idena.io/${item.delegatorAddress.toLowerCase()}`}
                                      alt="pic"
                                      width="32"
                                    />
                                  </div>
                                  <div
                                    className="text_block text_block--ellipsis"
                                    style={{width: 150}}
                                  >
                                    <Link
                                      href="/identity/[address]/epoch/[epoch]/rewards"
                                      as={`/identity/${item.delegatorAddress}/epoch/${epoch}/rewards`}
                                    >
                                      <a>{item.delegatorAddress}</a>
                                    </Link>
                                  </div>
                                </td>
                                <td>{identityStatusFmt(item.prevState)}</td>
                                <td>{identityStatusFmt(item.state)}</td>
                                {validation && (
                                  <td>{precise6(validationReward) || '-'}</td>
                                )}
                                {staking && (
                                  <>
                                    <td>{precise6(stakingReward) || '-'}</td>
                                    <td>{precise6(candidateReward) || '-'}</td>
                                  </>
                                )}
                                <td>{precise6(flipsReward) || '-'}</td>
                                <td>{precise6(invitaionReward) || '-'}</td>
                                <td>{precise6(reportsReward) || '-'}</td>
                                <td>
                                  {precise6(
                                    item.rewards.reduce(
                                      (prev, cur) => prev + cur.balance * 1,
                                      0
                                    )
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                      </Fragment>
                    ))}
                </tbody>
              </table>
              <div
                className="text-center"
                style={{display: canFetchMore ? 'block' : 'none'}}
              >
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => fetchMore()}
                >
                  Show more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Rewards
