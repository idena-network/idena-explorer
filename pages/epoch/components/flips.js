import { getEpochFlips, getEpochFlipsCount } from '../../../shared/api';
import TooltipText from '../../../shared/components/tooltip';
import {
  epochFmt,
  flipQualificationStatusFmt,
  dateTimeFmt,
  iconToSrc,
} from '../../../shared/utils/utils';
import { useInfiniteQuery, useQuery } from 'react-query';
import Link from 'next/link';
import { SkeletonRows } from '../../../shared/components/skeleton';

const LIMIT = 30;

export default function Flips({ epoch, visible }) {
  const fetchFlips = (_, epoch, skip = 0) => getEpochFlips(epoch, skip, LIMIT);

  const { data: flipsCount } = useQuery(
    visible && ['epoch/flipsCount', epoch],
    (_, epoch) => getEpochFlipsCount(epoch)
  );

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && `${epoch}/flips`,
    [epoch],
    fetchFlips,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Flip</th>
            <th>Author</th>
            <th style={{ width: 100 }}>Submission time</th>
            <th style={{ width: 90 }}>Size</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={4}></SkeletonRows>)}
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
                      ></img>
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{ width: 200 }}
                    >
                      <Link href="/flip/[cid]" as={`/flip/${item.cid}`}>
                        <a>{item.cid}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div className="user-pic">
                      <img
                        src={
                          'https://robohash.org/' + item.author.toLowerCase()
                        }
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{ width: 200 }}
                    >
                      <Link
                        href="/identity/[address]"
                        as={`/identity/${item.author}`}
                      >
                        <a>{item.author}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
                  <td>{item.size}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      <div
        className="text-center"
        style={{ display: canFetchMore ? 'block' : 'none' }}
      >
        <button className="btn btn-small" onClick={() => fetchMore()}>
          Show more (
          {data.reduce((prev, cur) => prev + (cur ? cur.length : 0), 0)} of{' '}
          {flipsCount})
        </button>
      </div>
    </div>
  );
}
