import { dateTimeFmt, precise6, dnaFmt } from '../../../shared/utils/utils';
import Link from 'next/link';
import { getTransactions, getTransactionsCount } from '../../../shared/api';
import { useInfiniteQuery, useQuery } from 'react-query';
import { SkeletonRows } from '../../../shared/components/skeleton';

const LIMIT = 30;

export default function Transactions({ address, visible }) {
  const fetchTransactions = (_, address, skip = 0) =>
    getTransactions(address, skip, LIMIT);

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && `${address}/transactions`,
    [address],
    fetchTransactions,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  const { data: transactionsCount } = useQuery(
    visible && `${address}/transactions/count`,
    [address],
    (_, address) => getTransactionsCount(address)
  );

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th style={{ width: 100 }}>Timestamp</th>
            <th style={{ width: 100 }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={6}></SkeletonRows>)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.hash}>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{ width: 80 }}
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
                        src={
                          'https://robohash.org/' +
                          (item.from && item.from.toLowerCase())
                        }
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{ width: 100 }}
                    >
                      {address.toLowerCase() == item.from.toLowerCase() ? (
                        item.from
                      ) : (
                        <Link
                          href="/address/[address]"
                          as={`/address/${item.from}`}
                        >
                          <a>{item.from}</a>
                        </Link>
                      )}
                    </div>
                  </td>
                  <td>
                    {item.to ? (
                      <>
                        <div className="user-pic">
                          <img
                            src={
                              'https://robohash.org/' + item.to.toLowerCase()
                            }
                            alt="pic"
                            width="32"
                          />
                        </div>
                        <div
                          className="text_block text_block--ellipsis"
                          style={{ width: 100 }}
                        >
                          {address.toLowerCase() == item.to.toLowerCase() ? (
                            item.to
                          ) : (
                            <Link
                              href="/address/[address]"
                              as={`/address/${item.to}`}
                            >
                              <a>{item.to}</a>
                            </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text_block text_block--ellipsis">-</div>
                    )}
                  </td>
                  <td>
                    {dnaFmt(
                      precise6(
                        !(item.amount * 1) && typeof item.transfer !== undefined
                          ? item.transfer
                          : item.amount
                      ),
                      ''
                    )}
                  </td>
                  <td>{dateTimeFmt(item.timestamp)}</td>
                  <td>{item.type}</td>
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
          {transactionsCount})
        </button>
      </div>
    </div>
  );
}
