import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {getPoolSizeHistory} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {epochFmt} from '../../../shared/utils/utils'

const LIMIT = 30

export default function History({address, visible}) {
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

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Start size</th>
            <th>Validation size</th>
            <th>End size</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
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
                  <td>{item.endSize}</td>
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
