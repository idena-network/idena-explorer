import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {
  getEpochIdentityRewards,
  getEpochIdentityRewardsCount,
  getEpochRewardsSummary,
} from '../../../../shared/api'
import {identityStatusFmt, precise2} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Distribution({epoch, visible}) {
  const {data: rewardsSummary} = useQuery(
    epoch && epoch >= 0 && ['epoch/rewardsSummary', epoch],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )
  const validation =
    rewardsSummary && rewardsSummary.validation && rewardsSummary.validation > 0
  const staking =
    rewardsSummary && rewardsSummary.staking && rewardsSummary.staking > 0
  const cols = validation ? 8 : staking ? 9 : 7

  const fetchRewards = (_, epoch, continuationToken = null) =>
    getEpochIdentityRewards(epoch, LIMIT, continuationToken)

  const fetchRewardsCount = (_, epoch) => getEpochIdentityRewardsCount(epoch)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && [`${epoch}/rewards`, epoch],
    fetchRewards,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: identitiesCount} = useQuery(
    epoch > 0 && visible && ['epoch/rewards/count', epoch],
    fetchRewardsCount
  )

  const getReward = (arr, type) => {
    const item = arr.find((x) => x.type === type)
    if (!item) {
      return 0
    }
    return item.balance * 1 + item.stake * 1
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Identity</th>
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
          {!visible || (status === 'loading' && <SkeletonRows cols={cols} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => {
                  const validationReward = getReward(item.rewards, 'Validation')
                  const stakingReward = getReward(item.rewards, 'Staking')
                  const candidateReward = getReward(item.rewards, 'Candidate')
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

                  const reportsReward = getReward(item.rewards, 'Reports')

                  return (
                    <tr key={item.address}>
                      <td>
                        <div className="user-pic">
                          <img
                            src={`https://robohash.idena.io/${item.address.toLowerCase()}`}
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
                            as={`/identity/${item.address}/epoch/${
                              epoch + 1
                            }/rewards`}
                          >
                            <a>{item.address}</a>
                          </Link>
                        </div>
                      </td>
                      <td>{identityStatusFmt(item.prevState)}</td>
                      <td>{identityStatusFmt(item.state)}</td>
                      {validation && (
                        <td>{precise2(validationReward) || '-'}</td>
                      )}
                      {staking && (
                        <>
                          <td>{precise2(stakingReward) || '-'}</td>
                          <td>{precise2(candidateReward) || '-'}</td>
                        </>
                      )}
                      <td>
                        {precise2(flipsReward) ||
                          (item.prevState === 'Newbie' ||
                          item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise2(invitaionReward) ||
                          (item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise2(reportsReward) ||
                          (item.prevState === 'Newbie' ||
                          item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise2(
                          item.rewards.reduce(
                            (prev, cur) =>
                              prev + cur.balance * 1 + cur.stake * 1,
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
          Show more (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {identitiesCount})
        </button>
      </div>
    </div>
  )
}
