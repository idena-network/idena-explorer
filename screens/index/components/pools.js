import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {getPools, getPoolsCount} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Pools({visible}) {
  const fetchPools = (_, continuationToken = null) =>
    getPools(LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && 'pools',
    fetchPools,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: poolsCount} = useQuery(visible && 'poolsCount', getPoolsCount)

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={3} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.address}>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${item.address.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div className="text_block text_block--ellipsis">
                      <Link href="/pool/[address]" as={`/pool/${item.address}`}>
                        <a>{item.address}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{item.size}</td>
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
          Show more (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {poolsCount})
        </button>
      </div>
    </div>
  )
}
