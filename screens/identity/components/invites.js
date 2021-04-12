import {useInfiniteQuery, useQuery} from 'react-query'
import Link from 'next/link'
import {getIdentityInvites, getIdentityInvitesCount} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'
import {epochFmt, dateTimeFmt} from '../../../shared/utils/utils'
import {SkeletonRows} from '../../../shared/components/skeleton'

const LIMIT = 10

export default function Invites({address, visible}) {
  const fetchInvites = (_, address, continuationToken = null) =>
    getIdentityInvites(address, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    address && visible && `${address}/invites`,
    [address],
    fetchInvites,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  const {data: invitesCount} = useQuery(
    address && visible && `${address}/invites/count`,
    [address],
    (_, address) => getIdentityInvitesCount(address)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>
              <TooltipText tooltip="Invitation transaction">
                Invitation
              </TooltipText>
            </th>
            <th>Issued</th>
            <th>
              <TooltipText tooltip="Activation transaction">
                Activation
              </TooltipText>
            </th>
            <th>Activated</th>
            <th>Invited identity</th>
            <th style={{width: 160}}>
              <TooltipText tooltip="Validation result of the invited person">
                Validation
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
                <tr key={item.hash}>
                  <td>
                    <Link
                      href="/epoch/[epoch]"
                      as={`/epoch/${item.epoch}#invitations`}
                    >
                      <a>{epochFmt(item.epoch)}</a>
                    </Link>
                  </td>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 60}}
                    >
                      <Link
                        href="/transaction/[hash]"
                        as={`/transaction/${item.hash}`}
                      >
                        <a>{item.hash}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
                  {item.activationHash ? (
                    <>
                      <td>
                        <div
                          className="text_block text_block--ellipsis"
                          style={{width: 120}}
                        >
                          <Link
                            href="/transaction/[hash]"
                            as={`/transaction/${item.activationHash}`}
                          >
                            <a>{item.activationHash}</a>
                          </Link>
                        </div>
                      </td>
                      <td>{dateTimeFmt(item.activationTimestamp)}</td>
                      <td>
                        <div
                          className="text_block text_block--ellipsis"
                          style={{width: 120}}
                        >
                          <Link
                            href="/identity/[address]"
                            as={`/identity/${item.activationAuthor}`}
                          >
                            <a>
                              <img
                                className="user-pic"
                                src={`https://robohash.idena.io/${item.activationAuthor.toLowerCase()}`}
                                alt="pic"
                                width="32"
                              />
                              <span>{item.activationAuthor}</span>
                            </a>
                          </Link>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>Not activated</td>
                      <td>-</td>
                      <td>-</td>
                    </>
                  )}
                  <td>
                    {item.state
                      ? item.state === 'Undefined'
                        ? 'Failed'
                        : 'Successful'
                      : '-'}
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
          {invitesCount})
        </button>
      </div>
    </div>
  )
}
