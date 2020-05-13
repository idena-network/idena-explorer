import { identityStatusFmt, precise6 } from '../../../../../shared/utils/utils';
import Link from 'next/link';
import {
  getEpochIdentityRewards,
  getEpochIdentityRewardsCount,
} from '../../../../../shared/api';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Fragment } from 'react';
import { SkeletonRows } from '../../../../../shared/components/skeleton';

const LIMIT = 30;

export default function Distribution({ epoch, visible }) {
  const fetchRewards = (_, epoch, skip = 0) =>
    getEpochIdentityRewards(epoch, skip, LIMIT);

  const fetchRewardsCount = (_, epoch) => getEpochIdentityRewardsCount(epoch);

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && [`${epoch}/rewards`, epoch],
    fetchRewards,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  const { data: identitiesCount } = useQuery(
    visible && ['epoch/rewards/count', epoch],
    fetchRewardsCount
  );

  const getReward = (arr, type) => {
    const item = arr.find((x) => x.type === type);
    if (!item) {
      return 0;
    }
    return item.balance * 1 + item.stake * 1;
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Identity</th>
            <th>
              Previous <br />
              status
            </th>
            <th>Status</th>
            <th style={{ width: 80 }}>
              Validation
              <br />
              reward,
              <br />
              DNA
            </th>
            <th style={{ width: 80 }}>
              Flips
              <br />
              reward,
              <br />
              DNA
            </th>
            <th style={{ width: 80 }}>
              Invitation
              <br />
              reward,
              <br />
              DNA
            </th>
            <th style={{ width: 80 }}>
              Total
              <br />
              reward,
              <br />
              DNA
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={7}></SkeletonRows>)}
          {data.map((page, i) => (
            <Fragment key={i}>
              {page &&
                page.map((item) => {
                  const validationReward = getReward(
                    item.rewards,
                    'Validation'
                  );
                  const invitaionReward =
                    getReward(item.rewards, 'Invitations') +
                    getReward(item.rewards, 'Invitations2') +
                    getReward(item.rewards, 'Invitations3');

                  const flipsReward = getReward(item.rewards, 'Flips');

                  return (
                    <tr key={item.address}>
                      <td>
                        <div className="user-pic">
                          <img
                            src={
                              'https://robohash.org/' +
                              item.address.toLowerCase()
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
                      <td>{precise6(validationReward) || '-'}</td>
                      <td>
                        {precise6(flipsReward) ||
                          (item.prevState === 'Newbie' ||
                          item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise6(invitaionReward) ||
                          (item.prevState === 'Verified' ||
                          item.prevState === 'Human'
                            ? '-'
                            : 'N/A')}
                      </td>
                      <td>
                        {precise6(
                          item.rewards.reduce(
                            (prev, cur) =>
                              prev + cur.balance * 1 + cur.stake * 1,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
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
          {identitiesCount})
        </button>
      </div>
    </div>
  );
}
