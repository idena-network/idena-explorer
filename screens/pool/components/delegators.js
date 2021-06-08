import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {getPoolDelegators} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {identityStatusFmt} from '../../../shared/utils/utils'

const LIMIT = 30

export default function Delegators({address}) {
  const fetchDelegators = (_, address, continuationToken = null) =>
    getPoolDelegators(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && `pool/${address}/delegators`,
    [address],
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
            <th>Address</th>
            <th>Status</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && <SkeletonRows cols={2} />}
          {data.map(
            (page) =>
              page &&
              page.map((item) => {
                const delegatorInfo = item
                return (
                  <tr key={delegatorInfo.address}>
                    <td>
                      <div className="user-pic">
                        <img
                          src={`https://robohash.idena.io/${delegatorInfo.address.toLowerCase()}`}
                          alt="pic"
                          width="32"
                        />
                      </div>
                      <div className="text_block text_block--ellipsis">
                        <Link
                          href="/address/[address]"
                          as={`/address/${delegatorInfo.address}`}
                        >
                          <a>{delegatorInfo.address}</a>
                        </Link>
                      </div>
                    </td>
                    <td>{identityStatusFmt(delegatorInfo.state)}</td>
                    <td>{delegatorInfo.age}</td>
                  </tr>
                )
              })
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
