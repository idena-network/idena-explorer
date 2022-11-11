import {useQuery} from 'react-query'
import Link from 'next/link'
import {TabContent, TabPane, NavItem, NavLink} from 'reactstrap'
import {useRouter} from 'next/router'
import Layout from '../../../../../../shared/components/layout'
import {
  getEpochRewardsSummary,
  getIdentityRewardedFlipsByEpoch,
  getIdentityRewardedInvitesByEpoch,
  getIdentitySavedInviteRewardsByEpoch,
  getIdentityAvailableInvitesByEpoch,
  getIdentityReportRewardsByEpoch,
  getIdentityValidationSummary,
} from '../../../../../../shared/api'
import {
  epochFmt,
  dnaFmt,
  identityStatusFmt,
  iconToSrc,
  flipQualificationStatusFmt,
  isIdentityPassed,
  precise1,
} from '../../../../../../shared/utils/utils'
import TooltipText from '../../../../../../shared/components/tooltip'
import {
  useHash,
  useHashChange,
} from '../../../../../../shared/utils/useHashChange'

const DEFAULT_TAB = '#flips'
const REPORT_REWARD_FUND_FIRST_EPOCH = 75

function Reward() {
  const router = useRouter()
  const address = router.query.address || ''
  const epoch = parseInt(router.query.epoch || 0)

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: rewardsSummary} = useQuery(
    address && epoch && ['epoch/rewardsSummary', epoch - 1],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )
  const validation =
    rewardsSummary && rewardsSummary.validation && rewardsSummary.validation > 0
  const staking =
    rewardsSummary && rewardsSummary.staking && rewardsSummary.staking > 0

  const {data: rewardedFlips} = useQuery(
    address && epoch && ['epoch/identity/rewardedFlips', address, epoch - 1],
    (_, address, epoch) => getIdentityRewardedFlipsByEpoch(address, epoch)
  )

  const {data: rewardedInvites} = useQuery(
    address && epoch && ['epoch/identity/rewardedInvites', address, epoch - 1],
    (_, address, epoch) => getIdentityRewardedInvitesByEpoch(address, epoch)
  )

  const {data: availableInvites} = useQuery(
    address && epoch && ['epoch/identity/availableInvites', address, epoch - 1],
    (_, address, epoch) => getIdentityAvailableInvitesByEpoch(address, epoch)
  )

  const {data: savedInvites} = useQuery(
    address && epoch && ['epoch/identity/savedInvites', address, epoch - 1],
    (_, address, epoch) => getIdentitySavedInviteRewardsByEpoch(address, epoch)
  )

  const {data: reportRewards} = useQuery(
    address && epoch && ['epoch/identity/reportRewards', address, epoch - 1],
    (_, address, epoch) => getIdentityReportRewardsByEpoch(address, epoch)
  )

  const {data: validationSummary} = useQuery(
    address &&
      epoch && ['epoch/identity/validationSummary', address, epoch - 1],
    (_, address, epoch) => getIdentityValidationSummary(address, epoch)
  )

  const identityInfo = validationSummary

  const getPenalizationReason = (reason) => {
    switch (reason) {
      case 'WrongWords':
        return 'Yes (flip was reported)'
      case 'QualifiedByNone':
        return 'Yes (flip was not available)'
      case 'NoQualifiedFlips':
        return 'Yes (non of the flips are qualified)'
      default:
    }
    return ''
  }

  const getInvitationsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.invitations &&
      validationSummary.rewards.invitations.earned * 1) ||
    0

  const getValidationReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.validation &&
      validationSummary.rewards.validation.earned * 1) ||
    0

  const getStakingReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.staking &&
      validationSummary.rewards.staking.earned * 1) ||
    0

  const getCandidateReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.candidate &&
      validationSummary.rewards.candidate.earned * 1) ||
    0

  const getFlipsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.flips &&
      validationSummary.rewards.flips.earned * 1) ||
    0

  const getReportsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.reports &&
      validationSummary.rewards.reports.earned * 1) ||
    0

  const getMissingValidationReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.validation &&
      validationSummary.rewards.validation.missed * 1) ||
    0

  const getMissingStakingReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.staking &&
      validationSummary.rewards.staking.missed * 1) ||
    0

  const getMissingCandidateReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.candidate &&
      validationSummary.rewards.candidate.missed * 1) ||
    0

  const getMissingFlipsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.flips &&
      validationSummary.rewards.flips.missed * 1) ||
    0

  const getMissingInvitationsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.invitations &&
      validationSummary.rewards.invitations.missed * 1) ||
    0

  const getMissingReportsReward = () =>
    (validationSummary &&
      validationSummary.rewards &&
      validationSummary.rewards.reports &&
      validationSummary.rewards.reports.missed * 1) ||
    0

  const validationPenalty = validationSummary &&
    validationSummary.penalized && {
      reason: validationSummary.penaltyReason,
    }

  const invitationRewards = [
    ...getRewardedData(
      epoch - 1,
      rewardsSummary,
      rewardedInvites,
      validationPenalty,
      identityInfo
    ),
    ...getCurrentEpochSavedInvites(epoch - 1, savedInvites, rewardsSummary),
    ...getPreviousEpochSavedInvites(
      epoch - 1,
      1,
      availableInvites,
      rewardedInvites,
      rewardsSummary
    ),
    ...getPreviousEpochSavedInvites(
      epoch - 1,
      2,
      availableInvites,
      rewardedInvites,
      rewardsSummary
    ),
  ]

  const reportRewardsData = getReportRewardsData(
    reportRewards,
    rewardsSummary,
    validationPenalty,
    identityInfo
  )

  const stake =
    (validationSummary &&
      validationSummary.stake &&
      validationSummary.stake * 1) ||
    0
  const epy = (stake && getStakingReward() / stake) || 0
  const epochDays =
    (rewardsSummary &&
      rewardsSummary.epochDuration &&
      rewardsSummary.epochDuration / 4320) ||
    0
  const apy = (epochDays && (epy / epochDays) * 366) || 0

  return (
    <Layout title={`Identity rewards ${address} for epoch ${epochFmt(epoch)}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.idena.io/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
              <div className="verified_sign">
                {identityInfo && identityInfo.state === 'Human' && (
                  <i className="icon icon--status" />
                )}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">
                <span>Identity rewards for epoch </span>
                <span>{epochFmt(epoch)}</span>
              </h1>
              <h3 className="section_main__subtitle">{address}</h3>

              <h3 className="section_main__subtitle">
                {identityInfo
                  ? isIdentityPassed(identityInfo.state)
                    ? 'Successful validation'
                    : 'Validation failed'
                  : '-'}
              </h3>
            </div>
            <div className="button-group">
              <Link
                href="/identity/[address]/epoch/[epoch]/validation"
                as={`/identity/${address}/epoch/${epoch}/validation`}
              >
                <a className="btn btn-secondary btn-small">
                  <i className="icon icon--report" />
                  <span>Validation results</span>
                </a>
              </Link>

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
                <div className="control-label">Identity:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: '80%'}}
                >
                  <Link href="/identity/[address]" as={`/identity/${address}`}>
                    <a>{address}</a>
                  </Link>
                </div>
                <hr />

                <div className="control-label">Status:</div>
                <div className="text_block">
                  {(identityInfo && identityStatusFmt(identityInfo.state)) ||
                    '-'}
                </div>
                <hr />

                <div className="control-label">Validation result:</div>
                <div className="text_block">
                  {identityInfo
                    ? identityInfo.missed
                      ? identityInfo.shortAnswersCount
                        ? 'Late submission'
                        : 'Missed validation'
                      : isIdentityPassed(identityInfo.state)
                      ? 'Successful'
                      : 'Wrong answers'
                    : '-'}
                </div>

                {validationSummary && validationSummary.delegateeReward && (
                  <>
                    <hr />
                    <div className="control-label">Delegated to pool:</div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: '65%'}}
                    >
                      <Link
                        href="/pool/[address]/epoch/[epoch]/rewards"
                        as={`/pool/${validationSummary.delegateeReward.address}/epoch/${epoch}/rewards`}
                      >
                        <a>{validationSummary.delegateeReward.address}</a>
                      </Link>
                    </div>
                  </>
                )}

                {staking && (
                  <>
                    <hr />
                    <div className="control-label">Staking APY:</div>
                    <div className="text_block">
                      {apy ? `${precise1(apy * 100)}%` : '-'}
                    </div>
                  </>
                )}
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
                <hr />

                <div className="control-label">
                  Status before the validation:
                </div>
                <div className="text_block">
                  {(identityInfo &&
                    identityStatusFmt(identityInfo.prevState)) ||
                    '-'}
                </div>
                <hr />

                <div className="control-label">Validation penalty:</div>
                <div className="text_block">
                  <span>
                    {validationPenalty
                      ? getPenalizationReason(validationPenalty.reason)
                      : 'No'}
                  </span>
                  <i
                    className={`icon ${
                      validationPenalty
                        ? 'icon--micro_fail'
                        : 'icon--micro_success'
                    }`}
                  />
                </div>

                {validationSummary && validationSummary.delegateeReward && (
                  <>
                    <hr />
                    <div className="control-label">
                      Paid to pool for validation:
                    </div>
                    <div className="text_block">
                      {dnaFmt(validationSummary.delegateeReward.amount)}
                    </div>
                  </>
                )}
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
                          getValidationReward() +
                            getFlipsReward() +
                            getInvitationsReward() +
                            getReportsReward() +
                            getStakingReward() +
                            getCandidateReward(),
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
                        {dnaFmt(getValidationReward(), '')}
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
                          {dnaFmt(getStakingReward(), '')}
                        </h3>
                        <TooltipText
                          className="control-label"
                          data-toggle="tooltip"
                          tooltip="Quadratic staking reward"
                        >
                          Staking
                        </TooltipText>
                      </div>
                      {identityInfo && identityInfo.prevState === 'Candidate' && (
                        <div className="bordered-col col">
                          <h3 className="info_block__accent">
                            {dnaFmt(getCandidateReward(), '')}
                          </h3>
                          <TooltipText
                            className="control-label"
                            data-toggle="tooltip"
                            tooltip="Reward for the first successful validation"
                          >
                            Candidate
                          </TooltipText>
                        </div>
                      )}
                    </>
                  )}
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {dnaFmt(getFlipsReward(), '')}
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
                      {dnaFmt(getInvitationsReward(), '')}
                    </h3>
                    <div
                      className="control-label"
                      data-toggle="tooltip"
                      title="Reward for validated invitations"
                    >
                      Invitations
                    </div>
                  </div>
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {dnaFmt(getReportsReward(), '')}
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

      <section className="section section_info">
        <div className="row">
          <div className={`col-12 col-sm-${validation ? 4 : 3}`}>
            <h3>Missed rewards, iDNA</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-12 bordered-col">
                    <h3 className="info_block__accent">
                      <span style={{color: 'red'}}>
                        {(rewardsSummary &&
                          identityInfo &&
                          dnaFmt(
                            getMissingValidationReward() +
                              getMissingFlipsReward() +
                              getMissingInvitationsReward() +
                              getMissingReportsReward() +
                              getMissingStakingReward() +
                              getMissingCandidateReward(),
                            ''
                          )) ||
                          '-'}
                      </span>
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Total rewards missed"
                    >
                      Total
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`col-12 col-sm-${validation ? 8 : 9}`}>
            <h3>Rewards not paid, iDNA</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  {validation && (
                    <div className="bordered-col col">
                      <h3 className="info_block__accent" style={{color: 'red'}}>
                        {dnaFmt(getMissingValidationReward(), '')}
                      </h3>
                      <TooltipText
                        className="control-label"
                        data-toggle="tooltip"
                        tooltip="Missed reward for successful validation"
                      >
                        Validation
                      </TooltipText>
                    </div>
                  )}
                  {staking && (
                    <>
                      <div className="bordered-col col">
                        <h3
                          className="info_block__accent"
                          style={{color: 'red'}}
                        >
                          {dnaFmt(getMissingStakingReward(), '')}
                        </h3>
                        <TooltipText
                          className="control-label"
                          data-toggle="tooltip"
                          tooltip="Missed quadratic staking reward"
                        >
                          Staking
                        </TooltipText>
                      </div>
                      {identityInfo && identityInfo.prevState === 'Candidate' && (
                        <div className="bordered-col col">
                          <h3
                            className="info_block__accent"
                            style={{color: 'red'}}
                          >
                            {dnaFmt(getMissingCandidateReward(), '')}
                          </h3>
                          <TooltipText
                            className="control-label"
                            data-toggle="tooltip"
                            tooltip="Missed reward for the first successful validation"
                          >
                            Candidate
                          </TooltipText>
                        </div>
                      )}
                    </>
                  )}
                  <div className="bordered-col col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingFlipsReward(), '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed rewards for flips"
                    >
                      Flips
                    </TooltipText>
                  </div>
                  <div className="bordered-col col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingInvitationsReward(), '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed rewards invitations"
                    >
                      Invitations
                    </TooltipText>
                  </div>
                  <div className="bordered-col col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingReportsReward(), '')}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed rewards for reports"
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
                    <NavLink
                      active={
                        hashReady && (hash === DEFAULT_TAB || hash === '')
                      }
                      href={DEFAULT_TAB}
                    >
                      <h3>Flips rewards</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#invitations'}
                      href="#invitations"
                    >
                      <h3>Invitations rewards</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#reports'}
                      href="#reports"
                    >
                      <h3>Flips qualification rewards</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Flip</th>
                        <th>Keywords</th>
                        <th>
                          <TooltipText tooltip="Flips qualification status">
                            Status
                          </TooltipText>
                        </th>
                        <th style={{width: 100}}>
                          Reward <br />
                          paid, iDNA
                        </th>
                        <th style={{width: 100}}>
                          Missed
                          <br />
                          reward, iDNA
                        </th>
                        <th style={{width: 100}}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {identityInfo &&
                        [
                          ...Array(
                            identityInfo.availableFlips - identityInfo.madeFlips
                          ).keys(),
                        ].map((_, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="user-pic">
                                <img
                                  src="/static/images/flip_icn.png"
                                  alt="flip_icon"
                                />
                              </div>
                              <div className="text_block text_block--ellipsis">
                                Flip was not submitted
                              </div>
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td style={{color: 'red'}}>
                              {dnaFmt(
                                rewardsSummary && rewardsSummary.flipsShare,
                                ''
                              )}
                            </td>
                            <td>
                              {validationPenalty ? '-' : 'Missing extra flip'}
                            </td>
                          </tr>
                        ))}
                      {rewardedFlips &&
                        rewardedFlips.map((item) => (
                          <tr key={item.cid}>
                            <td>
                              <div className="user-pic">
                                <img
                                  src={
                                    item.icon
                                      ? iconToSrc(item.icon)
                                      : '/static/images/flip_icn.png'
                                  }
                                  alt="pic"
                                  width="44"
                                  height="44"
                                />
                              </div>
                              <div
                                className="text_block text_block--ellipsis"
                                style={{width: 200}}
                              >
                                <Link
                                  href="/flip/[cid]"
                                  as={`/flip/${item.cid}`}
                                >
                                  <a>{item.cid}</a>
                                </Link>
                              </div>
                            </td>
                            <td>
                              {item.words ? (
                                <>
                                  {item.wrongWords ||
                                  item.status === 'QualifiedByNone' ? (
                                    <i className="icon icon--micro_fail" />
                                  ) : item.grade > 2 ? (
                                    <i className="icon icon--micro_best" />
                                  ) : (
                                    <i className="icon icon--micro_success" />
                                  )}
                                  <span>
                                    {`${item.words.word1.name}/${item.words.word2.name}`}
                                  </span>
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              {item.status
                                ? flipQualificationStatusFmt(item.status)
                                : '-'}
                            </td>
                            <td>
                              {dnaFmt(
                                rewardsSummary &&
                                  item.rewarded &&
                                  rewardsSummary.flipsShare *
                                    getFlipGradeRewardCoef(item.grade),
                                ''
                              )}
                            </td>
                            <td style={{color: 'red'}}>
                              {dnaFmt(
                                rewardsSummary &&
                                  !item.rewarded &&
                                  rewardsSummary.flipsShare,
                                ''
                              )}
                            </td>
                            <td>
                              {validationPenalty ? 'Validation penalty' : '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>

            <TabPane tabId="#invitations">
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Epoch</th>
                        <th>
                          <TooltipText tooltip="Invitation transaction">
                            Invitation
                          </TooltipText>
                        </th>

                        <th>Invited identity</th>

                        <th style={{width: 160}}>
                          <TooltipText tooltip="Validation result of the invited person">
                            Validation
                          </TooltipText>
                        </th>

                        <th style={{width: 100}}>
                          Reward <br />
                          paid, iDNA
                        </th>
                        <th style={{width: 100}}>
                          Missed
                          <br />
                          reward, iDNA
                        </th>
                        <th style={{width: 100}}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitationRewards
                        .sort((a, b) => b.epoch - a.epoch)
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="text_block text_block--ellipsis">
                                <Link
                                  href="/epoch/[epoch]"
                                  as={`/epoch/${item.epoch}`}
                                >
                                  <a>{epochFmt(item.epoch)}</a>
                                </Link>
                              </div>
                            </td>
                            <td>
                              <div
                                className="text_block text_block--ellipsis"
                                style={{width: 200}}
                              >
                                {(item.hash && (
                                  <Link
                                    href="/transaction/[hash]"
                                    as={`/transaction/${item.hash}`}
                                  >
                                    <a>{item.hash}</a>
                                  </Link>
                                )) ||
                                  item.title}
                              </div>
                            </td>
                            <td>
                              {(item.activationAuthor && (
                                <>
                                  <div className="user-pic">
                                    <img
                                      src={`https://robohash.idena.io/${item.activationAuthor.toLowerCase()}`}
                                      alt="pic"
                                      width="32"
                                    />
                                  </div>
                                  <div
                                    className="text_block text_block--ellipsis"
                                    style={{width: 120}}
                                  >
                                    <Link
                                      href="/identity/[address]"
                                      as={`/identity/${item.activationAuthor}`}
                                    >
                                      <a>{item.activationAuthor}</a>
                                    </Link>
                                  </div>
                                </>
                              )) ||
                                '-'}
                            </td>
                            <td>{item.validationResult}</td>
                            <td>{dnaFmt(item.invitationReward, '')}</td>
                            <td style={{color: 'red'}}>
                              {dnaFmt(item.missingInvitationReward, '')}
                            </td>
                            <td>{item.reason}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>

            <TabPane tabId="#reports">
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Flip</th>
                        <th>Author</th>
                        <th>Keywords</th>
                        <th style={{width: 100}}>
                          Reward <br />
                          paid, iDNA
                        </th>
                        <th style={{width: 100}}>
                          Missed <br />
                          reward, iDNA
                        </th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportRewardsData &&
                        reportRewardsData.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="user-pic">
                                <img
                                  src={
                                    item.icon
                                      ? iconToSrc(item.icon)
                                      : '/static/images/flip_icn.png'
                                  }
                                  alt="pic"
                                  width="44"
                                  height="44"
                                />
                              </div>
                              <div
                                className="text_block text_block--ellipsis"
                                style={{width: 200}}
                              >
                                <Link
                                  href="/flip/[cid]"
                                  as={`/flip/${item.cid}`}
                                >
                                  <a>{item.cid}</a>
                                </Link>
                              </div>
                            </td>
                            <td>
                              <div className="user-pic">
                                <img
                                  src={`https://robohash.idena.io/${item.author.toLowerCase()}`}
                                  alt="pic"
                                  width="32"
                                />
                              </div>
                              <div
                                className="text_block text_block--ellipsis"
                                style={{width: 100}}
                              >
                                <Link
                                  href="/identity/[address]"
                                  as={`/identity/${item.author}#flips`}
                                >
                                  <a>{item.author}</a>
                                </Link>
                              </div>
                            </td>
                            <td>
                              {item.words ? (
                                <>
                                  <i className="icon icon--micro_fail" />
                                  <span>
                                    {`${item.words.word1.name}/${item.words.word2.name}`}
                                  </span>
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>{dnaFmt(item.reward, '')}</td>
                            <td style={{color: 'red'}}>
                              {dnaFmt(item.missingReward, '')}
                            </td>
                            <td>{item.details}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function getRewardedData(
  epoch,
  rewardsSummary,
  rewardedInvites,
  validationPenalty,
  identityInfo
) {
  if (!rewardsSummary || !rewardedInvites) {
    return []
  }
  return rewardedInvites
    .map((item) => {
      if (item.killInviteeHash || !item.activationHash) {
        return null
      }

      let isValidated = false
      let result = '-'

      if (item.state) {
        if (isIdentityPassed(item.state)) {
          isValidated = true
          result = 'Successfull'
        } else {
          result = 'Failed'
        }
      }

      let rewardCoef = 3
      if (item.epoch === epoch - 1) {
        rewardCoef *= 3
      } else if (item.epoch === epoch - 2) {
        rewardCoef *= 6
      }

      let invitationReward
      let missingInvitationReward
      let reason

      const maxInvitationReward = rewardsSummary.invitationsShare * rewardCoef
      let coef =
        (rewardsSummary.epochDuration &&
          item.epochHeight / rewardsSummary.epochDuration) ||
        0
      if (coef > 1) {
        coef = 1
      }
      coef = 1.0 - 0.5 * coef ** 4
      invitationReward = maxInvitationReward * coef
      missingInvitationReward = 0
      reason = '-'

      if (isValidated && validationPenalty) {
        reason = 'Validation penalty'
        missingInvitationReward = maxInvitationReward
        invitationReward = 0
      } else if (!isValidated) {
        reason = 'Invitee failed'
        missingInvitationReward = maxInvitationReward
        invitationReward = 0
      } else if (identityInfo && !isIdentityPassed(identityInfo.state)) {
        missingInvitationReward = maxInvitationReward
        invitationReward = 0
        reason = 'My validation failed'
      } else if (!item.rewardType) {
        missingInvitationReward = maxInvitationReward
        invitationReward = 0
        reason = 'Another issuer'
      } else if (maxInvitationReward > invitationReward) {
        missingInvitationReward = maxInvitationReward - invitationReward
        reason = 'Late activation'
      }

      return {
        epoch: item.epoch,
        hash: item.hash,
        activationAuthor: item.activationAuthor,
        validationResult: result,
        invitationReward,
        missingInvitationReward,
        reason,
      }
    })
    .filter((x) => x)
}

function getCurrentEpochSavedInvites(epoch, savedInvites, rewardsSummary) {
  if (!savedInvites || !rewardsSummary) {
    return []
  }
  const res = []
  for (let i = 0; i < savedInvites.length; i += 1) {
    const item = savedInvites[i]
    let invitationReward = rewardsSummary.invitationsShare * 1
    let missingInvitationReward = invitationReward

    if (item.value === 'SavedInvite') {
      missingInvitationReward *= 2 // not a winner => x2
    }
    if (item.value === 'SavedInviteWin') {
      invitationReward *= 2 // winner => x2
    }

    for (let j = 0; j < item.count; j += 1) {
      res.push({
        epoch,
        title: 'Saved invitation',
        validationResult: '-',
        invitationReward,
        missingInvitationReward,
        reason: 'Missed invitation',
      })
    }
  }

  return res
}

function getPreviousEpochSavedInvites(
  epoch,
  back,
  availableInvites,
  rewardedInvites,
  rewardsSummary
) {
  if (!availableInvites || !rewardsSummary) {
    return []
  }
  const available = availableInvites.find((x) => x.epoch === epoch - back)
  if (!available) {
    return []
  }
  const activatedCount = (rewardedInvites || []).filter(
    (x) => x.epoch === epoch - back && x.activationHash
  )
  const res = []
  for (let i = 0; i < available.invites - activatedCount; i += 1) {
    let rewardCoef = 9
    if (back === 2) {
      rewardCoef *= 2
    }
    const invitationReward = 0
    const missingInvitationReward = rewardsSummary.invitationsShare * rewardCoef

    res.push({
      epoch: epoch - back,
      title: 'Saved invitation',
      validationResult: '-',
      invitationReward,
      missingInvitationReward,
      reason: 'Missed invitation',
    })
  }
  return res
}

function getReportRewardsData(
  reportRewards,
  rewardsSummary,
  validationPenalty,
  identityInfo
) {
  if (!reportRewards || !rewardsSummary || !identityInfo) {
    return []
  }
  return reportRewards.map((item) => {
    const reward = item.balance * 1 + item.stake * 1
    let missingReward = 0
    let details = '-'
    if (!(reward && reward > 0)) {
      missingReward =
        rewardsSummary.epoch &&
        rewardsSummary.epoch >= REPORT_REWARD_FUND_FIRST_EPOCH
          ? rewardsSummary.reportsShare
          : rewardsSummary.flipsShare / 5.0
      if (validationPenalty) {
        details = 'Validation penalty'
      } else if (!isIdentityPassed(identityInfo.state)) {
        details = 'My validation failed'
      } else if (item.grade === 1) {
        details = 'Flip with no reward'
      } else {
        details = 'Did not report'
      }
    }

    return {
      cid: item.cid,
      author: item.author,
      icon: item.icon,
      reward,
      missingReward,
      details,
      words: item.words,
    }
  })
}

function getFlipGradeRewardCoef(grade) {
  if (!grade || grade <= 1 || grade > 5) {
    return 0
  }
  return 2 ** (grade - 2)
}

export default Reward
