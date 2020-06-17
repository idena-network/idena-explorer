import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {
  getEpochIdentities,
  getEpochIdentitiesCount,
} from '../../../../shared/api'
import {precise2, identityStatusFmt} from '../../../../shared/utils/utils'
import {SkeletonRows} from '../../../../shared/components/skeleton'

const LIMIT = 30

export default function Identities({epoch, visible, states, prevStates}) {
  const fetchIdentities = (
    _,
    epoch,
    states,
    prevStates,
    continuationToken = null
  ) => getEpochIdentities(epoch, LIMIT, continuationToken, states, prevStates)

  const fetchEpochIdentitiesCount = (_, epoch, states, prevStates) =>
    getEpochIdentitiesCount(epoch, states, prevStates)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && [`${epoch}/identities`, epoch, states, prevStates],
    fetchIdentities,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: identitiesCount} = useQuery(
    epoch > 0 &&
      visible && ['epoch/identites/count', epoch, states, prevStates],
    fetchEpochIdentitiesCount
  )

  const formatPoints = (point, count) =>
    `${point} out of ${count} (${precise2((point / count) * 100)}%)`

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
            <th>
              Validation <br /> score
            </th>
            <th>
              Qualification <br /> score
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
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
                          href="/identity/[address]"
                          as={`/identity/${item.address}`}
                        >
                          <a>{item.address}</a>
                        </Link>
                      </div>
                    </td>
                    <td>{identityStatusFmt(item.prevState)}</td>
                    <td>{identityStatusFmt(item.state)}</td>
                    <td>
                      {(item.shortAnswers.flipsCount &&
                        formatPoints(
                          item.shortAnswers.point,
                          item.shortAnswers.flipsCount
                        )) ||
                        '-'}
                    </td>
                    <td>
                      {(item.longAnswers.flipsCount &&
                        formatPoints(
                          item.longAnswers.point,
                          item.longAnswers.flipsCount
                        )) ||
                        '-'}
                    </td>
                    <td>
                      <Link
                        href="/identity/[address]/epoch/[epoch]/validation"
                        as={`/identity/${item.address}/epoch/${
                          epoch + 1
                        }/validation`}
                      >
                        <a>
                          <i className="icon icon--thin_arrow_right" />
                        </a>
                      </Link>
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
          {identitiesCount})
        </button>
      </div>
    </div>
  )
}
