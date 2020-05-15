import Link from 'next/link'
import {useInfiniteQuery, useQuery} from 'react-query'
import {Fragment} from 'react'
import {getEpochInvitations, getEpochInvitesSummary} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 30

export default function Invitations({epoch, visible}) {
  const fetchInvitations = (_, epoch, skip = 0) =>
    getEpochInvitations(epoch, skip, LIMIT)

  const {data: invitesSummary} = useQuery(
    visible && ['epoch/invitesSummary', epoch],
    (_, epoch) => getEpochInvitesSummary(epoch)
  )

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && `${epoch}/invitations`,
    [epoch],
    fetchInvitations,
    {
      getFetchMore: (lastGroup, allGroups) =>
        lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>
              <TooltipText tooltip="Invitation transaction">
                Invitation
              </TooltipText>
            </th>
            <th>Issuer</th>
            <th>
              <TooltipText tooltip="Activation transaction">
                Activation
              </TooltipText>
            </th>
            <th>Invited identity</th>
            <th>
              <TooltipText tooltip="Validation result of the invited person">
                Validation
              </TooltipText>
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={5} />)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => (
                  <tr key={item.address}>
                    <td>
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: 100}}
                      >
                        <Link
                          href="/transaction/[hash]"
                          as={`/transaction/${item.hash}`}
                        >
                          <a>{item.hash}</a>
                        </Link>
                      </div>
                    </td>

                    <td>
                      <div className="user-pic">
                        <img
                          src={`https://robohash.org/${item.author.toLowerCase()}`}
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
                          as={`/identity/${item.author}`}
                        >
                          <a>{item.author}</a>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div
                        className="text_block text_block--ellipsis"
                        style={{width: 100}}
                      >
                        {item.activationHash ? (
                          <Link
                            href="/transaction/[hash]"
                            as={`/transaction/${item.activationHash}`}
                          >
                            <a>{item.activationHash}</a>
                          </Link>
                        ) : (
                          'Not activated'
                        )}
                      </div>
                    </td>
                    <td>
                      {item.activationAuthor ? (
                        <>
                          <div className="user-pic">
                            <img
                              src={`https://robohash.org/${item.activationAuthor.toLowerCase()}`}
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
                              as={`/identity/${item.activationAuthor}`}
                            >
                              <a>{item.activationAuthor}</a>
                            </Link>
                          </div>{' '}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {item.state
                        ? item.state === 'Undefined'
                          ? 'Failed'
                          : 'Successful'
                        : '-'}
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
          {invitesSummary && invitesSummary.allCount})
        </button>
      </div>
    </div>
  )
}
