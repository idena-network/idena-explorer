import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {dateTimeFmt, epochFmt, dnaFmt} from '../../../shared/utils/utils'
import {getPenalties, getPenaltiesCount} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Penalties({address, visible}) {
  const fetchPenalties = (_, address, continuationToken = null) =>
    getPenalties(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `${address}/penalties`,
    [address],
    fetchPenalties,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: penaltiesCount} = useQuery(
    address && visible && `${address}/penalties/count`,
    [address],
    (_, address) => getPenaltiesCount(address)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{width: 100}}>Epoch</th>
            <th>Block</th>
            <th>Timestamp</th>
            <th>Penalty, iDNA</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.blockHeight}>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 100}}
                    >
                      <Link href="/epoch/[epoch]" as={`/epoch/${item.epoch}`}>
                        <a>{epochFmt(item.epoch)}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div className="text_block text_block--ellipsis">
                      <Link
                        href="/block/[block]"
                        as={`/block/${item.blockHeight}`}
                      >
                        <a>{item.blockHeight}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
                  <td align="right">{dnaFmt(item.penalty)}</td>
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
          {penaltiesCount})
        </button>
      </div>
    </div>
  )
}
