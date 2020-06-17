import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {getEpochsData, getEpochsDataCount} from '../../../shared/api'
import {epochFmt, precise2, dnaFmt, dateFmt} from '../../../shared/utils/utils'
import TooltipText from '../../../shared/components/tooltip'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 10

export default function EpochsTable({visible}) {
  const fetchEpochs = (_, continuationToken = null) =>
    getEpochsData(LIMIT + 1, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && `epochs`,
    fetchEpochs,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? parseInt(lastGroup.continuationToken, 10) + 1
          : false,
    }
  )

  const {data: epochsCount} = useQuery(
    visible && 'epochsCount',
    getEpochsDataCount
  )

  const prepareEpochData = (currentEpoch, previousEpoch) => ({
    epoch: currentEpoch.epoch,
    validationTime: previousEpoch.validationTime,
    validatedCount: previousEpoch.validatedCount,
    blockCount: currentEpoch.blockCount,
    txCount: currentEpoch.txCount,
    flipCount: currentEpoch.flipCount,
    inviteCount: currentEpoch.inviteCount,
    lastRewards: precise2(previousEpoch.rewards.total),
    lastTotalMined: precise2(
      previousEpoch.rewards.total * 1 +
        (currentEpoch.coins.minted - currentEpoch.rewards.total)
    ),
    burnt: precise2(currentEpoch.coins.burnt),
  })

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>
              <TooltipText tooltip="Validation ceremony date">
                Validation
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Total identities validated">
                Identities <br />
              </TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Invitations sent">Invites</TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Flips submitted">Flips</TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Transactions number">Txs</TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Blocks mined">
                Blocks <br />
              </TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Validation rewards paid">
                Rewards,
                <br />
                iDNA
              </TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Total minted per epoch: (block rewards, validation rewards)">
                Minted,
                <br />
                iDNA
              </TooltipText>
            </th>

            <th>
              <TooltipText tooltip="Total burnt per epoch: (fees, penalties, lost stakes, etc)">
                Burnt,
                <br />
                iDNA
              </TooltipText>
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={10} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item, idx) => {
                  if (idx === page.length - 1) {
                    return null
                  }
                  const data = prepareEpochData(item, page[idx + 1])
                  return (
                    <tr key={data.epoch}>
                      <td>
                        <Link href="/epoch/[epoch]" as={`/epoch/${data.epoch}`}>
                          <a>{epochFmt(data.epoch)}</a>
                        </Link>
                      </td>
                      <td>{dateFmt(data.validationTime)}</td>
                      <td>
                        <Link
                          href="/epoch/[epoch]/validation"
                          as={`/epoch/${data.epoch}/validation`}
                        >
                          <a>{data.validatedCount}</a>
                        </Link>
                      </td>
                      <td>{data.inviteCount}</td>
                      <td>{data.flipCount}</td>
                      <td>{data.txCount}</td>
                      <td>{data.blockCount}</td>

                      <td>
                        <Link
                          href="/epoch/[epoch]/rewards"
                          as={`/epoch/${data.epoch}/rewards`}
                        >
                          <a>{dnaFmt(data.lastRewards, '')}</a>
                        </Link>
                      </td>

                      <td>{dnaFmt(data.lastTotalMined, '')}</td>
                      <td>{dnaFmt(data.burnt, '')}</td>
                    </tr>
                  )
                })}
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
          {data.reduce((prev, cur) => prev + (cur ? cur.length - 1 : 0), 0)} of{' '}
          {epochsCount})
        </button>
      </div>
    </div>
  )
}
