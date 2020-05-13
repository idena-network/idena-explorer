import {
  getAddressFlips,
  getLastEpoch,
  getAddressFlipsCount,
} from '../../../shared/api';
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

const LIMIT = 10;

export default function Flips({ address, visible }) {
  const fetchFlips = (_, address, skip = 0) =>
    getAddressFlips(address, skip, LIMIT);

  const { data: lastEpoch } = useQuery(visible && 'lastEpoch', (_) =>
    getLastEpoch()
  );

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && `${address}/flips`,
    [address],
    fetchFlips,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  const { data: flipsCount } = useQuery(
    visible && `${address}/flips/count`,
    [address],
    (_, address) => getAddressFlipsCount(address)
  );

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>
              <TooltipText tooltip="Validation session">Validation</TooltipText>
            </th>
            <th>Flip</th>
            <th>Keywords</th>
            <th>
              <TooltipText tooltip="Flips qualification status">
                Status
              </TooltipText>
            </th>
            <th style={{ width: 100 }}>Created</th>
            <th style={{ width: 90 }}>Size</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={6}></SkeletonRows>)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.cid}>
                  <td>
                    <div className="text_block text_block--ellipsis">
                      {lastEpoch && item.epoch !== lastEpoch.epoch ? (
                        <Link
                          href="/epoch/[epoch]/validation"
                          as={`/epoch/${item.epoch + 1}/validation`}
                        >
                          <a>{epochFmt(item.epoch + 1)}</a>
                        </Link>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
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
                      style={{ width: 120 }}
                    >
                      <Link href="/flip/[cid]" as={`/flip/${item.cid}`}>
                        <a>{item.cid}</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    {item.words ? (
                      <>
                        {item.wrongWords ||
                        item.status === 'QualifiedByNone' ? (
                          <i className="icon icon--micro_fail"></i>
                        ) : (
                          <i className="icon icon--micro_success"></i>
                        )}
                        <span>
                          {item.words.word1.name}
                          {' / '}
                          {item.words.word2.name}
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{flipQualificationStatusFmt(item.status || '-')}</td>
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
