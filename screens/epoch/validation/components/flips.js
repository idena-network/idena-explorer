import {useInfiniteQuery, useQuery} from 'react-query'
import Link from 'next/link'
import {getEpochFlips, getEpochFlipsCount} from '../../../../shared/api'
import TooltipText from '../../../../shared/components/tooltip'
import {SkeletonRows} from '../../../../shared/components/skeleton'
import {iconToSrc} from '../../../../shared/utils/utils'

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
            <th>
              <TooltipText tooltip="Keywords used to create flip">
                Keywords
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Number of identities being challenged with the flip on short/long session">
                Short /<br /> Long
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Agreed answer">Answer</TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Qualification committee consensus about the flip">
                Consensus
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Votes for bad flip">
                Bad flip
                <br />
                reported
              </TooltipText>
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={7} />)}
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
                      {item.withPrivatePart && (
                        <div className="locked_sign">
                          <i className="icon icon--lock" />
                        </div>
                      )}
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 100}}
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
                      style={{width: 100}}
                    >
                      <Link
                        href="/identity/[address]"
                        as={`/identity/${item.author}#flips`}
                      >
                        <a>{item.author}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    {item.words ? (
                      <>
                        {item.wrongWords ? (
                          <i className="icon icon--micro_fail" />
                        ) : (
                          <i className="icon icon--micro_success" />
                        )}
                        <span>
                          {`${item.words.word1.name}/${item.words.word2.name}`}
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  {!item.status ? (
                    <>
                      <td>Not used</td>
                      <td>-</td>
                      <td>-</td>
                    </>
                  ) : (
                    <>
                      <td>
                        {`${item.shortRespCount} / ${item.longRespCount}`}
                      </td>
                      <td>
                        {item.status === 'Qualified' ||
                        item.status === 'WeaklyQualified'
                          ? item.answer
                          : '-'}
                      </td>
                      <td>
                        {item.status === 'WeaklyQualified'
                          ? 'Weak'
                          : item.status === 'Qualified'
                          ? 'Strong'
                          : 'No consensus'}
                      </td>
                    </>
                  )}
                  <td>
                    {(item.wrongWordsVotes !== 0 && item.wrongWordsVotes) ||
                      '-'}
                  </td>
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
