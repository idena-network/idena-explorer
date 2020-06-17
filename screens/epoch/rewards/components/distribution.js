import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {
  getEpochIdentityRewards,
  getEpochIdentityRewardsCount,
} from '../../../../shared/api'
import {identityStatusFmt, precise6} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Distribution({epoch, visible}) {
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
          {!visible || (status === 'loading' && <SkeletonRows cols={7} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => {
                  const validationReward = getReward(item.rewards, 'Validation')
                  const invitaionReward =
                    getReward(item.rewards, 'Invitations') +
                    getReward(item.rewards, 'Invitations2') +
                    getReward(item.rewards, 'Invitations3')

                  const flipsReward =
                    getReward(item.rewards, 'Flips') +
                    getReward(item.rewards, 'Reports')

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
                      <td>{precise6(validationReward) || '-'}</td>
                      <td>
                        {precise6(flipsReward) ||
                          (item.prevState === 'Newbie' ||
                          item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise6(invitaionReward) ||
                          (item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise6(
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
