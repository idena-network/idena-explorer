import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {precise2, dnaFmt} from '../../../shared/utils/utils'
import {getBalances} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function TopAddress({visible}) {
  const fetchBalances = (_, continuationToken = null) =>
    getBalances(LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && 'topaddress',
    fetchBalances,
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
            <th>Balance</th>
            <th>Stake</th>
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
                      <Link
                        href="/address/[address]"
                        as={`/address/${item.address}`}
                      >
                        <a>{item.address}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dnaFmt(precise2(item.balance), '')}</td>
                  <td>{dnaFmt(precise2(item.stake), '')}</td>
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
