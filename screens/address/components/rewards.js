import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {getRewards, getRewardsCount} from '../../../shared/api'
import {
  rewardTypeFmt,
  precise6,
  dnaFmt,
  epochFmt,
} from '../../../shared/utils/utils'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Rewards({address, visible}) {
  const fetchRewards = (_, address, continuationToken = null) =>
    getRewards(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `${address}/rewards`,
    [address],
    fetchRewards,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: rewardsCount} = useQuery(
    address && visible && `${address}/rewards/count`,
    [address],
    (_, address) => getRewardsCount(address)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{width: 100}}>Epoch</th>
            <th>Reward type</th>
            <th>Paid to wallet, iDNA</th>
            <th>Paid to stake, iDNA</th>
            <th>Total, iDNA</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={5} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item, j) =>
                  item.rewards.map((reward, k) => (
                    <tr key={`${i}_${j}_${k}`}>
                      <td>
                        <div
                          className="text_block text_block--ellipsis"
                          style={{width: 100}}
                        >
                          <Link
                            href="/identity/[address]/epoch/[epoch]/rewards"
                            as={`/identity/${address}/epoch/${
                              item.epoch + 1
                            }/rewards`}
                          >
                            <a>{epochFmt(item.epoch + 1)}</a>
                          </Link>
                        </div>
                      </td>
                      <td>{rewardTypeFmt(reward.type)}</td>
                      <td align="right">{dnaFmt(reward.balance, '')}</td>
                      <td align="right">{dnaFmt(reward.stake, '')}</td>
                      <td align="right">
                        {dnaFmt(
                          precise6(reward.stake * 1 + reward.balance * 1),
                          ''
                        )}
                      </td>
                      <td>{item.type}</td>
                    </tr>
                  ))
                )}
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
          {rewardsCount})
        </button>
      </div>
    </div>
  )
}
