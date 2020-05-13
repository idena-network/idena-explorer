import { useEffect, useState } from 'react';
import { dateTimeFmt, precise6, dnaFmt } from '../../../shared/utils/utils';
import Link from 'next/link';
import { getTransactions, getBlockTransactions } from '../../../shared/api';
import { useInfiniteQuery } from 'react-query';

const LIMIT = 10;

export default function Transactions({ block }) {
  const fetchTransactions = (_, block, skip = 0) =>
    getBlockTransactions(block, skip, LIMIT);

  const { data, fetchMore, canFetchMore } = useInfiniteQuery(
    `${block}/transactions`,
    [block],
    fetchTransactions,
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
            <th>Transaction</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th style={{ width: 100 }}>Timestamp</th>
            <th style={{ width: 100 }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.hash}>
                  <td>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{ width: 100 }}
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
                      style={{ width: 120 }}
                    >
                      <Link
                        href="/address/[address]"
                        as={`/address/${item.from}`}
                      >
                        <a>{item.from}</a>
                      </Link>
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
                          style={{ width: 120 }}
                        >
                          <Link
                            href="/address/[address]"
                            as={`/address/${item.to}`}
                          >
                            <a>{item.to}</a>
                          </Link>
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
          Show more
        </button>
      </div>
    </div>
  );
}
