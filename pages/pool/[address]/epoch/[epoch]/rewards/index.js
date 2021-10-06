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
} from '../../../../../../shared/api'
import {epochFmt, dnaFmt, precise6} from '../../../../../../shared/utils/utils'
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
  const invitationsReward =
    (totalRewards &&
      getReward(totalRewards.rewards, 'Invitations') +
        getReward(totalRewards.rewards, 'Invitations2') +
        getReward(totalRewards.rewards, 'Invitations3') +
        getReward(totalRewards.rewards, 'SavedInvite') +
        getReward(totalRewards.rewards, 'SavedInviteWin')) ||
    0

  const flipsReward =
    (totalRewards &&
      getReward(totalRewards.rewards, 'Flips') +
        getReward(totalRewards.rewards, 'Reports')) ||
    0

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
                          validationReward + flipsReward + invitationsReward
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
                      {dnaFmt(validationReward)}
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
                      {dnaFmt(flipsReward)}
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
                      {dnaFmt(invitationsReward)}
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

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink active>
                      <h3>Delegator rewards</h3>
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
                    <th style={{width: 80}}>
                      Validation
                      <br />
                      reward,
                      <br />
                      iDNA
                    </th>
                    <th style={{width: 80}}>
                      Flips
                      <br />
                      reward,
                      <br />
                      iDNA
                    </th>
                    <th style={{width: 80}}>
                      Invitation
                      <br />
                      reward,
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
                  {status === 'loading' && <SkeletonRows cols={6} />}
                  {data &&
                    data.map((page, i) => (
                      <Fragment key={i}>
                        {page &&
                          page.map((item) => {
                            const validationReward = getReward(
                              item.rewards,
                              'Validation'
                            )
                            const invitaionReward =
                              getReward(item.rewards, 'Invitations') +
                              getReward(item.rewards, 'Invitations2') +
                              getReward(item.rewards, 'Invitations3')

                            const flipsReward =
                              getReward(item.rewards, 'Flips') +
                              getReward(item.rewards, 'Reports')

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
                                  <div className="text_block text_block--ellipsis">
                                    <Link
                                      href="/identity/[address]/epoch/[epoch]/rewards"
                                      as={`/identity/${item.delegatorAddress}/epoch/${epoch}/rewards`}
                                    >
                                      <a>{item.delegatorAddress}</a>
                                    </Link>
                                  </div>
                                </td>
                                <td>{precise6(validationReward) || '-'}</td>
                                <td>{precise6(flipsReward) || '-'}</td>
                                <td>{precise6(invitaionReward) || '-'}</td>
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
