import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {precise2, precise6, dateTimeFmt} from '../../../shared/utils/utils'
import {getEpochBlocks, getEpochBlocksCount} from '../../../shared/api'
import TooltipText, {IconTooltip} from '../../../shared/components/tooltip'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Blocks({epoch, visible}) {
  const fetchBlocks = (_, epoch, skip = 0) => getEpochBlocks(epoch, skip, LIMIT)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && `${epoch}/blocks`,
    [epoch],
    fetchBlocks,
    {
      getFetchMore: (lastGroup, allGroups) =>
        lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false,
    }
  )

  const {data: blocksCount} = useQuery(
    visible && ['epoch/blocksCount', epoch],
    (_, epoch) => getEpochBlocksCount(epoch)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Block</th>
            <th>Block issuer</th>
            <th>
              <TooltipText tooltip="Block issuer verifiable random score">
                Issuer
                <br />
                score
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Mininum score for the block proposer selection">
                Proposing
                <br />
                threshold
              </TooltipText>
            </th>
            <th>Flags</th>
            <th>Created</th>
            <th>
              Size,
              <br />
              bytes
            </th>
            <th>
              <TooltipText tooltip="Number of transactions">Txs</TooltipText>
            </th>
            <th>
              Minted,
              <br />
              DNA
            </th>
            <th>
              Burnt,
              <br />
              DNA
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={10} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => (
                  <tr key={item.height}>
                    <td>
                      <div className="text_block text_block--ellipsis">
                        <Link
                          href="/block/[block]"
                          as={`/block/${item.height}`}
                        >
                          <a>{item.height}</a>
                        </Link>
                      </div>
                    </td>
                    <td>
                      {item.proposer ? (
                        <>
                          <div className="user-pic">
                            <img
                              src={`https://robohash.org/${item.proposer.toLowerCase()}`}
                              alt="pic"
                              width="32"
                            />
                          </div>
                          <div
                            className="text_block text_block--ellipsis"
                            style={{width: 80}}
                          >
                            <Link
                              href="/identity/[address]"
                              as={`/identity/${item.proposer}`}
                            >
                              <a>{item.proposer}</a>
                            </Link>
                          </div>
                        </>
                      ) : (
                        'Empty block'
                      )}
                    </td>
                    <td>
                      {item.proposer ? precise6(item.proposerVrfScore) : '-'}
                    </td>
                    <td>{precise6(item.vrfProposerThreshold)}</td>
                    <td>
                      {item.flags
                        ? item.flags.map((flag) => (
                            <BlockFlag key={flag} flag={flag} />
                          ))
                        : '-'}
                    </td>
                    <td>{dateTimeFmt(item.timestamp)}</td>
                    <td>{item.fullSize}</td>
                    <td>{item.txCount || '-'}</td>
                    <td>{precise2(item.coins.minted)}</td>
                    <td>{precise2(item.coins.burnt)}</td>
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
          {blocksCount})
        </button>
      </div>
    </div>
  )
}

function BlockFlag({flag}) {
  switch (flag) {
    case 'FlipLotteryStarted':
      return (
        <IconTooltip
          tooltip="Flip lottery is started"
          className="icon icon--timer"
          placement="top"
        />
      )
    case 'ShortSessionStarted':
      return (
        <IconTooltip
          tooltip="Short session is started"
          className="icon icon--timer"
          placement="top"
        />
      )
    case 'LongSessionStarted':
      return (
        <IconTooltip
          tooltip="Long session is started"
          className="icon icon--timer"
          placement="top"
        />
      )
    case 'AfterLongSessionStarted':
      return (
        <IconTooltip
          tooltip="Long session is finished"
          className="icon icon--timer"
          placement="top"
        />
      )
    case 'ValidationFinished':
      return (
        <IconTooltip
          tooltip="Validation session is finished"
          className="icon icon--timer"
          placement="top"
        />
      )
    case 'IdentityUpdate':
      return (
        <IconTooltip
          tooltip="List of mining identities is updated"
          className="icon icon--menu_contacts"
          placement="top"
        />
      )
    case 'OfflinePropose':
      return (
        <IconTooltip
          tooltip="Offline penalty is proposed"
          className="icon icon--laptop"
          placement="top"
        />
      )
    case 'OfflineCommit':
      return (
        <IconTooltip
          tooltip="Offline penalty is confirmed"
          className="icon icon--laptop-red"
          placement="top"
        />
      )
    case 'Snapshot':
      return (
        <IconTooltip
          tooltip="Snapshot is produced"
          className="icon icon--photo"
          placement="top"
        />
      )
    default:
  }
  return null
}
