import {useInfiniteQuery, useQuery} from 'react-query'
import Link from 'next/link'
import {getEpochFlips, getEpochFlipsCount} from '../../../shared/api'
import {dateTimeFmt, iconToSrc} from '../../../shared/utils/utils'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Flips({epoch, visible}) {
  const fetchFlips = (_, epoch, continuationToken = null) =>
    getEpochFlips(epoch, LIMIT, continuationToken)

  const {data: flipsCount} = useQuery(
    epoch > 0 && visible && ['epoch/flipsCount', epoch],
    (_, epoch) => getEpochFlipsCount(epoch)
  )

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && `${epoch}/flips`,
    [epoch],
    fetchFlips,
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
            <th>Flip</th>
            <th>Author</th>
            <th style={{width: 100}}>Submission time</th>
            <th style={{width: 90}}>Size</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.cid}>
                  <td>
                    <div className="user-pic">
                      <img
                        src={
                          item.icon
                            ? iconToSrc(item.icon)
                            : '/static/images/flip_icn.png'
                        }
                        alt="pic"
                        width="44"
                        height="44"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 200}}
                    >
                      <Link href="/flip/[cid]" as={`/flip/${item.cid}`}>
                        <a>{item.cid}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${item.author.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 200}}
                    >
                      <Link
                        href="/identity/[address]"
                        as={`/identity/${item.author}`}
                      >
                        <a>{item.author}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
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
          {flipsCount})
        </button>
      </div>
    </div>
  )
}
