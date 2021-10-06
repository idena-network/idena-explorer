import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {Fragment} from 'react'
import {getEpochDelegateeTotalRewards} from '../../../../shared/api'
import {precise6} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Pools({epoch, visible}) {
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
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {data &&
            data.map((page, i) => (
              <Fragment key={i}>
                {page &&
                  page.map((item) => {
                    const validationReward = getReward(
                      item.rewards,
                      'Validation'
                    )
                    const invitationsReward =
                      getReward(item.rewards, 'Invitations') +
                      getReward(item.rewards, 'Invitations2') +
                      getReward(item.rewards, 'Invitations3') +
                      getReward(item.rewards, 'SavedInvite') +
                      getReward(item.rewards, 'SavedInviteWin')

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
                            style={{width: 200}}
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
                        <td>{precise6(validationReward) || '-'}</td>
                        <td>{precise6(flipsReward) || '-'}</td>
                        <td>{precise6(invitationsReward) || '-'}</td>
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
  )
}
