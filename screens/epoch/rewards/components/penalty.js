import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {
  getEpochBadAuthors,
  getEpochBadAuthorsCount,
} from '../../../../shared/api'
import {identityStatusFmt} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Penalty({epoch, visible}) {
  const fetchBadAuthors = (_, epoch, continuationToken = null) =>
    getEpochBadAuthors(epoch, LIMIT, continuationToken)

  const fetchBadAuthorsCount = (_, epoch) => getEpochBadAuthorsCount(epoch)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && [`${epoch}/badAuthors`, epoch],
    fetchBadAuthors,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: badCount} = useQuery(
    epoch > 0 && visible && ['epoch/badAuthors/count', epoch],
    fetchBadAuthorsCount
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th>
              Previous <br />
              status
            </th>
            <th>Status</th>
            <th>Penalty details</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
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
                    <td>
                      {item.wrongWords
                        ? 'Flip irrelevant to keywords found'
                        : 'No qualified flips'}
                    </td>
                  </tr>
                ))}
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
          {badCount})
        </button>
      </div>
    </div>
  )
}
