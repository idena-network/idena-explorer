import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {
  getEpochDelegateeTotalRewards,
  getEpochRewardsSummary,
} from '../../../../shared/api'
import {precise2} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Pools({epoch, visible}) {
  const {data: rewardsSummary} = useQuery(
    epoch && epoch >= 0 && ['epoch/rewardsSummary', epoch],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )
  const validation =
    rewardsSummary && rewardsSummary.validation && rewardsSummary.validation > 0
  const staking =
    rewardsSummary && rewardsSummary.staking && rewardsSummary.staking > 0
  const cols = validation ? 7 : staking ? 8 : 6

  const fetchRewards = (_, epoch, continuationToken = null) =>
    getEpochDelegateeTotalRewards(epoch, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && [`${epoch}/poolTotalRewards`, epoch],
    fetchRewards,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const getReward = (arr, type) => {
    const item = arr.find((x) => x.type === type)
    if (!item) {
      return 0
    }
    return item.balance * 1
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Delegators</th>
            {validation && (
              <th style={{width: 80}}>
                Validation
                <br />
                rewards,
                <br />
                iDNA
              </th>
            )}
            {staking && (
              <>
                <th style={{width: 80}}>
                  Staking
                  <br />
                  rewards,
                  <br />
                  iDNA
                </th>
                <th style={{width: 80}}>
                  Candidate
                  <br />
                  rewards,
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
          {data &&
            data.map((page, i) => (
              <Fragment key={i}>
                {page &&
                  page.map((item) => {
                    const validationReward = getReward(
                      item.rewards,
                      'Validation'
                    )
                    const stakingReward = getReward(item.rewards, 'Staking')
                    const candidateReward = getReward(item.rewards, 'Candidate')
                    const invitationsReward =
                      getReward(item.rewards, 'Invitations') +
                      getReward(item.rewards, 'Invitations2') +
                      getReward(item.rewards, 'Invitations3') +
                      getReward(item.rewards, 'SavedInvite') +
                      getReward(item.rewards, 'SavedInviteWin') +
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
                              href="/pool/[address]/epoch/[epoch]/rewards"
                              as={`/pool/${item.address}/epoch/${
                                epoch + 1
                              }/rewards`}
                            >
                              <a>{item.address}</a>
                            </Link>
                          </div>
                        </td>
                        <td>{item.delegators}</td>
                        {validation && (
                          <td>{precise2(validationReward) || '-'}</td>
                        )}
                        {staking && (
                          <>
                            <td>{precise2(stakingReward) || '-'}</td>
                            <td>{precise2(candidateReward) || '-'}</td>
                          </>
                        )}
                        <td>{precise2(flipsReward) || '-'}</td>
                        <td>{precise2(invitationsReward) || '-'}</td>
                        <td>{precise2(reportsReward) || '-'}</td>
                        <td>
                          {precise2(
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
  )
}
