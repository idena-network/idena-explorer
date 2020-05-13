import { precise2, identityStatusFmt } from '../../../../../shared/utils/utils';
import Link from 'next/link';
import {
  getEpochBadAuthors,
  getEpochBadAuthorsCount,
} from '../../../../../shared/api';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Fragment } from 'react';
import { SkeletonRows } from '../../../../../shared/components/skeleton';

const LIMIT = 30;

export default function Penalty({ epoch, visible }) {
  const fetchBadAuthors = (_, epoch, skip = 0) =>
    getEpochBadAuthors(epoch, skip, LIMIT);

  const fetchBadAuthorsCount = (_, epoch) => getEpochBadAuthorsCount(epoch);

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && [`${epoch}/badAuthors`, epoch],
    fetchBadAuthors,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  const { data: badCount } = useQuery(
    visible && ['epoch/badAuthors/count', epoch],
    fetchBadAuthorsCount
  );

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th>
              Previous <br />
              status
            </th>
            <th>Status</th>
            <th>Penalty details</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={4}></SkeletonRows>)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => (
                  <tr key={item.address}>
                    <td>
                      <div className="user-pic">
                        <img
                          src={
                            'https://robohash.org/' + item.address.toLowerCase()
                          }
                          alt="pic"
                          width="32"
                        />
                      </div>
                      <div
                        className="text_block text_block--ellipsis"
                        style={{ width: 150 }}
                      >
                        <Link
                          href="/identity/[address]"
                          as={`/identity/${item.address}`}
                        >
                          <a>{item.address}</a>
                        </Link>
                      </div>
                    </td>
                    <td>{identityStatusFmt(item.prevState)}</td>
                    <td>{identityStatusFmt(item.state)}</td>
                    <td>
                      {item.wrongWords
                        ? 'Flip irrelevant to keywords found'
                        : 'No qualified flips'}
                    </td>
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div
        className="text-center"
        style={{ display: canFetchMore ? 'block' : 'none' }}
      >
        <button className="btn btn-small" onClick={() => fetchMore()}>
          Show more (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {badCount})
        </button>
      </div>
    </div>
  );
}
