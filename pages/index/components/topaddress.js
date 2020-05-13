import { precise2, dnaFmt } from '../../../shared/utils/utils';
import Link from 'next/link';
import { getBalances } from '../../../shared/api';
import { useInfiniteQuery } from 'react-query';
import { SkeletonRows } from '../../../shared/components/skeleton';

const LIMIT = 30;

export default function TopAddress({ visible }) {
  const fetchBalances = (_, skip = 0) => getBalances(skip, LIMIT);

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && 'topaddress',
    fetchBalances,
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
            <th>Address</th>
            <th>Balance</th>
            <th>Stake</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={3}></SkeletonRows>)}
          {data.map(
            (page) =>
              page &&
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
                    <div className="text_block text_block--ellipsis">
                      <Link
                        href="/address/[address]"
                        as={`/address/${item.address}`}
                      >
                        <a>{item.address}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dnaFmt(precise2(item.balance), '')}</td>
                  <td>{dnaFmt(precise2(item.stake), '')}</td>
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
          Show more
        </button>
      </div>
    </div>
  );
}
