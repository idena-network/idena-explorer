import Link from 'next/link'
import {useEffect, useState} from 'react'
import {useInfiniteQuery} from 'react-query'
import {
  precise6,
  dnaFmt,
  txTypeFmt,
  identityStatusFmt,
  timeSince,
} from '../../../shared/utils/utils'
import {
  getMempoolTxs,
  getPoolDelegators,
  getUpgrades,
} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {WarningTooltip} from '../../../shared/components/tooltip'

export default function HardForks({visible, limit = 10}) {
  const fetchDelegators = (_, continuationToken = null) =>
    getUpgrades(limit, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && `upgrades`,
    [],
    fetchDelegators,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Consensus version</th>
            <th>Block</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={3} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.upgrade}>
                  <td>
                    <Link
                      href="/hardfork/[upgrade]"
                      as={`/hardfork/${item.upgrade}`}
                    >
                      <a>{item.upgrade}</a>
                    </Link>
                  </td>
                  <td>
                    <Link href="/block/[block]" as={`/block/${item.height}`}>
                      <a>{item.height}</a>
                    </Link>
                  </td>
                  <td>{timeSince(item.timestamp, false)}</td>
                </tr>
              ))
          )}
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
