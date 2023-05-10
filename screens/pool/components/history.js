import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {getLastEpoch, getPoolSizeHistory} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {epochFmt} from '../../../shared/utils/utils'

const LIMIT = 10

export default function History({address, poolInfo, visible}) {
  const {data: lastEpoch} = useQuery('last-epoch', getLastEpoch)

  const fetchSizeHistory = (_, address, continuationToken = null) =>
    getPoolSizeHistory(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `pool/${address}/sizeHistory`,
    [address],
    fetchSizeHistory,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const latestHistoryItem = data && data.length && data[0].length && data[0][0]

  const currentEpochSize =
    latestHistoryItem &&
    lastEpoch &&
    latestHistoryItem.epoch === lastEpoch.epoch - 1
      ? latestHistoryItem.endSize
      : 0

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Validated identities</th>
            <th>
              Validated identities
              <br />
              before next validation
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={3} />)}
          {visible && lastEpoch && (currentEpochSize || poolInfo.size || '') && (
            <tr key={lastEpoch.epoch}>
              <td>
                <div className="text_block text_block--ellipsis">
                  <Link href="/epoch/[epoch]" as={`/epoch/${lastEpoch.epoch}`}>
                    <a>{epochFmt(lastEpoch.epoch)}</a>
                  </Link>
                </div>
              </td>
              <td>{currentEpochSize}</td>
              <td>{poolInfo.size}</td>
            </tr>
          )}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.epoch}>
                  <td>
                    <div className="text_block text_block--ellipsis">
                      <Link href="/epoch/[epoch]" as={`/epoch/${item.epoch}`}>
                        <a>{epochFmt(item.epoch)}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{item.startSize}</td>
                  <td>{item.validationSize}</td>
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
