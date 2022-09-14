import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import {Fragment} from 'react'
import {getMiningRewards} from '../../../shared/api'
import {dnaFmt, epochFmt} from '../../../shared/utils/utils'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Mining({address, visible}) {
  const fetchRewards = (_, address, continuationToken = null) =>
    getMiningRewards(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `${address}/mining`,
    [address],
    fetchRewards,
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
            <th>Mined, iDNA</th>
            <th>Burnt, iDNA</th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item, j) => (
                  <tr key={`${i}_${j}`}>
                    <td>
                      <div className="text_block text_block--ellipsis">
                        <Link href="/epoch/[epoch]" as={`/epoch/${item.epoch}`}>
                          <a>{epochFmt(item.epoch)}</a>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div
                        className="text_block text_block--ellipsis"
                        align="right"
                        style={{width: 150}}
                      >
                        {dnaFmt(item.amount, '')}
                      </div>
                    </td>
                    <td>
                      <div
                        className="text_block text_block--ellipsis"
                        align="right"
                        style={{width: 150}}
                      >
                        {dnaFmt(item.penalty, '')}
                      </div>
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
          Show more
        </button>
      </div>
    </div>
  )
}
