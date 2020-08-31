import {useQuery} from 'react-query'
import Link from 'next/link'
import {TabContent, TabPane, NavItem, NavLink} from 'reactstrap'
import {useRouter} from 'next/router'
import Layout from '../../../../../../shared/components/layout'
import {
  getEpochRewardsSummary,
  getIdentityAuthorsBadByEpoch,
  getIdentityByEpoch,
  getIdentityRewardsByEpoch,
  getIdentityRewardedFlipsByEpoch,
  getIdentityRewardedInvitesByEpoch,
  getIdentitySavedInviteRewardsByEpoch,
  getIdentityAvailableInvitesByEpoch,
} from '../../../../../../shared/api'
import {
  epochFmt,
  dnaFmt,
  identityStatusFmt,
  iconToSrc,
  flipQualificationStatusFmt,
  isIdentityPassed,
} from '../../../../../../shared/utils/utils'
import TooltipText from '../../../../../../shared/components/tooltip'
import {
  useHash,
  useHashChange,
} from '../../../../../../shared/utils/useHashChange'

const DEFAULT_TAB = '#flips'

function Reward() {
  const router = useRouter()
  const address = router.query.address || ''
  const epoch = parseInt(router.query.epoch || 0)

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: identityInfo} = useQuery(
    address && epoch && ['epoch/identity', address, epoch - 1],
    (_, address, epoch) => getIdentityByEpoch(address, epoch)
  )

  const {data: validationPenalty} = useQuery(
    address && epoch && ['epoch/identity/authors/bad', address, epoch - 1],
    (_, address, epoch) => getIdentityAuthorsBadByEpoch(address, epoch)
  )

  const {data: identityRewards} = useQuery(
    address && epoch && ['epoch/identity/rewards', address, epoch - 1],
    (_, address, epoch) => getIdentityRewardsByEpoch(address, epoch)
  )

  const {data: rewardsSummary} = useQuery(
    address && epoch && ['epoch/rewardsSummary', epoch - 1],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )

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

  const getPenalizationReason = (reason) => {
    switch (reason) {
      case 'WrongWords':
        return 'Yes (flip was reported)'
      case 'QualifiedByNone':
        return 'Yes (flip was not availalbe)'
      case 'NoQualifiedFlips':
        return 'Yes (non of the flips are qualified)'
      default:
    }
    return ''
  }

  const getReward = (arr, type) => {
    if (!arr) {
      return 0
    }
    const item = arr.find((x) => x.type === type)
    if (!item) {
      return 0
    }
    return item.balance * 1 + item.stake * 1
  }

  const getInvitationsReward = () =>
    getReward(identityRewards, 'Invitations') +
    getReward(identityRewards, 'Invitations2') +
    getReward(identityRewards, 'Invitations3') +
    getReward(identityRewards, 'SavedInvite') +
    getReward(identityRewards, 'SavedInviteWin')

  const getValidationReward = () => getReward(identityRewards, 'Validation')

  const getFlipsReward = () => getReward(identityRewards, 'Flips')

  const getMissingValidationReward = () =>
    (identityInfo &&
      rewardsSummary &&
      (!isIdentityPassed(identityInfo.state) || validationPenalty) &&
      (epoch - identityInfo.birthEpoch) ** (1 / 3) *
        rewardsSummary.validationShare) ||
    0

  const getMissingFlipsReward = () =>
    (rewardsSummary &&
      identityInfo &&
      Math.max(
        0,
        rewardsSummary.flipsShare * identityInfo.availableFlips -
          getFlipsReward()
      )) ||
    0

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

  const getMissingInvitationsReward = () =>
    invitationRewards.reduce(
      (prev, cur) => prev + cur.missingInvitationReward,
      0
    )

  return (
    <Layout title={`Identity rewards ${address} for epoch ${epochFmt(epoch)}`}>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.org/${address.toLowerCase()}`}
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
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">
                  Validation results for epoch:
                </div>
                <div className="text_block">
                  <Link
                    href="/epoch/[epoch]/validation"
                    as={`/epoch/${epoch}/validation`}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-4">
            <h3>Total reward</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-12 bordered-col">
                    <h3 className="info_block__accent">
                      <span>
                        {dnaFmt(
                          getValidationReward() +
                            getFlipsReward() +
                            getInvitationsReward()
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

          <div className="col-12 col-sm-8">
            <h3>Rewards paid </h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {dnaFmt(getValidationReward())}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Reward for succesfull validation"
                    >
                      Validation reward
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {dnaFmt(getFlipsReward())}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Reward for qualified flips"
                    >
                      Flip reward
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {dnaFmt(getInvitationsReward())}
                    </h3>
                    <div
                      className="control-label"
                      data-toggle="tooltip"
                      title="Reward for validated invitations"
                    >
                      Invitation reward
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-4">
            <h3>Missed rewards</h3>
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
                              getMissingInvitationsReward()
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

          <div className="col-12 col-sm-8">
            <h3>Rewards not paid</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingValidationReward())}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed reward for succesfull validation"
                    >
                      Validation reward
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingFlipsReward())}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed rewards for flips"
                    >
                      Flip reward
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent" style={{color: 'red'}}>
                      {dnaFmt(getMissingInvitationsReward())}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Missed rewards invitations"
                    >
                      Invitation reward
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
                                  rewardsSummary.flipsShare,
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
                                      src={`https://robohash.org/${item.activationAuthor.toLowerCase()}`}
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

      invitationReward = rewardsSummary.invitationsShare * rewardCoef
      missingInvitationReward = 0
      reason = '-'

      if (isValidated && validationPenalty) {
        reason = 'Validation penalty'
        missingInvitationReward = invitationReward
        invitationReward = 0
      } else if (!isValidated) {
        reason = 'Invitee failed'
        missingInvitationReward = invitationReward
        invitationReward = 0
      } else if (identityInfo && !isIdentityPassed(identityInfo.state)) {
        missingInvitationReward = invitationReward
        invitationReward = 0
        reason = 'My validation failed'
      } else if (!item.rewardType) {
        missingInvitationReward = invitationReward
        invitationReward = 0
        reason = 'Another issuer'
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
        title: 'Saved invititation reward',
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
  if (!rewardedInvites || !availableInvites) {
    return []
  }
  const available = availableInvites.find((x) => x.epoch === epoch - back)
  if (!available) {
    return []
  }
  const activatedCount = rewardedInvites.filter(
    (x) => x.epoch === epoch - back && x.activationHash
  )
  const res = []
  for (let i = 0; i < available.invites - activatedCount; i += 1) {
    const invitationReward = 0
    const missingInvitationReward =
      rewardsSummary.invitationsShare * 3 ** (1 + back)

    res.push({
      epoch: epoch - back,
      title: 'Saved invititation reward',
      validationResult: '-',
      invitationReward,
      missingInvitationReward,
      reason: 'Missed invitation',
    })
  }
  return res
}

export default Reward
