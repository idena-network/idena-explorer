import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {dateTimeFmt} from '../../../shared/utils/utils'
import {getUpgrades, getUpgradeVotings} from '../../../shared/api'
import {SkeletonRows} from '../../../shared/components/skeleton'

export default function HardForks({visible, limit = 10}) {
  const {data: upgradeVotings, upgradeVotingsStatus} = useQuery(
    visible && 'upgradeVotings',
    (_) => getUpgradeVotings(1)
  )

  const fetchUpgrades = (_, continuationToken = null) =>
    getUpgrades(limit, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && `upgrades`,
    [],
    fetchUpgrades,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const upgradeVoting =
    upgradeVotings &&
    upgradeVotings.length &&
    data &&
    (!data.length ||
      !data[0] ||
      !data[0].length ||
      upgradeVotings[0].upgrade !== data[0][0].upgrade) &&
    upgradeVotings[0]

  if (upgradeVoting) {
    const startDate = new Date(upgradeVoting.startActivationDate)
    const endDate = new Date(upgradeVoting.endActivationDate)
    const now = new Date()
    upgradeVoting.status =
      now < startDate ? 'Pending' : now < endDate ? 'Voting' : 'Finished'
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Consensus version</th>
            <th>Status</th>
            <th>Block</th>
            <th>Timestamp</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            ((status === 'loading' || upgradeVotingsStatus === 'loading') && (
              <SkeletonRows cols={5} />
            ))}
          {!(status === 'loading' || upgradeVotingsStatus === 'loading') &&
            upgradeVoting && (
              <>
                <tr key={upgradeVoting.upgrade}>
                  <td>
                    <Link
                      href="/hardfork/[upgrade]"
                      as={`/hardfork/${upgradeVoting.upgrade}`}
                    >
                      <a>#{upgradeVoting.upgrade}</a>
                    </Link>
                  </td>
                  <td>{upgradeVoting.status}</td>
                  <td>-</td>
                  <td>
                    {dateTimeFmt(upgradeVoting.startActivationDate)} -{' '}
                    {dateTimeFmt(upgradeVoting.endActivationDate)}
                  </td>
                  <td>
                    {upgradeVoting.url && (
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: 300}}
                      >
                        <Link href={upgradeVoting.url}>
                          <a target="_blank">{upgradeVoting.url}</a>
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              </>
            )}
          {!(status === 'loading' || upgradeVotingsStatus === 'loading') &&
            data.map(
              (page) =>
                page &&
                page.map((item) => (
                  <tr key={item.upgrade}>
                    <td>
                      <Link
                        href="/hardfork/[upgrade]"
                        as={`/hardfork/${item.upgrade}`}
                      >
                        <a>#{item.upgrade}</a>
                      </Link>
                    </td>
                    <td>Activated</td>
                    <td>
                      <Link href="/block/[block]" as={`/block/${item.height}`}>
                        <a>{item.height}</a>
                      </Link>
                    </td>
                    <td>{dateTimeFmt(item.timestamp)}</td>
                    <td>
                      {item.url && (
                        <div
                          className="text_block text_block--ellipsis"
                          style={{width: 300}}
                        >
                          <Link href={item.url}>
                            <a target="_blank">{item.url}</a>
                          </Link>
                        </div>
                      )}
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
          Show more
        </button>
      </div>
    </div>
  )
}
