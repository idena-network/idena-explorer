import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {precise2, identityStatusFmt} from '../../../shared/utils/utils'
import {getEpochIdentities, getEpochIdentitiesCount} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Identities({epoch, visible}) {
  const fetchIdentities = (_, epoch, continuationToken = null) =>
    getEpochIdentities(epoch, LIMIT, continuationToken)
  const fetchEpochIdentitiesCount = (_, epoch) => getEpochIdentitiesCount(epoch)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    epoch > 0 && visible && `${epoch}/identities`,
    [epoch],
    fetchIdentities,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: identitiesCount} = useQuery(
    epoch > 0 && visible && ['epoch/identites/count', epoch],
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
            <th style={{width: 190}}>Status</th>
            <th style={{width: 130}}>
              <TooltipText tooltip="Total validation score for all validations">
                Score
              </TooltipText>
            </th>
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
                      <div className="text_block text_block--ellipsis">
                        <Link
                          href="/identity/[address]"
                          as={`/identity/${item.address}`}
                        >
                          <a>{item.address}</a>
                        </Link>
                      </div>
                    </td>
                    <td>{identityStatusFmt(item.state)}</td>
                    <td>
                      {formatPoints(
                        item.totalShortAnswers.point,
                        item.totalShortAnswers.flipsCount
                      )}
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
