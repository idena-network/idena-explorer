import {
  getIdentityEpochs,
  getLastEpoch,
  getIdentityEpochsCount,
} from '../../../shared/api';
import TooltipText from '../../../shared/components/tooltip';
import {
  identityStatusFmt,
  dnaFmt,
  precise2,
  epochFmt,
} from '../../../shared/utils/utils';
import { useInfiniteQuery, useQuery } from 'react-query';
import Link from 'next/link';
import { SkeletonRows } from '../../../shared/components/skeleton';

const LIMIT = 10;

const PASSED = ['Newbie', 'Verified', 'Human'];

export default function Epochs({ address, visible }) {
  const fetchEpochs = (_, address, skip = 0) =>
    getIdentityEpochs(address, skip, LIMIT);

  const { data: lastEpoch } = useQuery(visible && 'lastEpoch', (_) =>
    getLastEpoch()
  );

  const { data, fetchMore, canFetchMore, status } = useInfiniteQuery(
    visible && `${address}/epochs`,
    [address],
    fetchEpochs,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup && lastGroup.length === LIMIT
          ? allGroups.length * LIMIT
          : false;
      },
    }
  );

  const { data: epochsCount } = useQuery(
    visible && `${address}/epochs/count`,
    [address],
    (_, address) => getIdentityEpochsCount(address)
  );

  const formatPoints = (point, count) => {
    return (
      point + ' out of ' + count + ' (' + precise2((point / count) * 100) + '%)'
    );
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 100 }}>Epoch</th>
            <th>
              <TooltipText tooltip="Identity status before the validation">
                Previous
                <br />
                status
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Identity validation status">
                Status
              </TooltipText>
            </th>
            <th style={{ width: 140 }}>
              Validation
              <br />
              reward, DNA
            </th>
            <th>
              Validation <br />
              score
            </th>
            <th>
              Qualification <br />
              score
            </th>
            <th style={{ width: 100 }}>Validated</th>
            <th style={{ width: 90 }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {!visible ||
            (status === 'loading' && <SkeletonRows cols={8}></SkeletonRows>)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => {
                if (lastEpoch && item.epoch === lastEpoch.epoch) {
                  return null;
                }
                const shortScoreTxt = item.shortAnswers.flipsCount
                  ? formatPoints(
                      item.shortAnswers.point,
                      item.shortAnswers.flipsCount
                    )
                  : '-';
                const longScoreTxt = item.longAnswers.flipsCount
                  ? formatPoints(
                      item.longAnswers.point,
                      item.longAnswers.flipsCount
                    )
                  : '-';

                if (PASSED.some((x) => x === item.state)) {
                  return (
                    <PassedIdentity
                      key={item.epoch}
                      identity={item}
                      address={address}
                      shortScoreTxt={shortScoreTxt}
                      longScoreTxt={longScoreTxt}
                    ></PassedIdentity>
                  );
                }
                if (item.missed) {
                  if (item.shortAnswers.flipsCount) {
                    return (
                      <LateSubmission
                        key={item.epoch}
                        identity={item}
                        address={address}
                        shortScoreTxt={shortScoreTxt}
                        longScoreTxt={longScoreTxt}
                      ></LateSubmission>
                    );
                  }
                  if (item.requiredFlips > item.madeFlips) {
                    return (
                      <NotAllowed
                        key={item.epoch}
                        identity={item}
                        address={address}
                      ></NotAllowed>
                    );
                  }
                  return (
                    <Missed
                      key={item.epoch}
                      identity={item}
                      address={address}
                    ></Missed>
                  );
                }
                return (
                  <WrongAnswers
                    key={item.epoch}
                    identity={item}
                    address={address}
                    shortScoreTxt={shortScoreTxt}
                    longScoreTxt={longScoreTxt}
                  ></WrongAnswers>
                );
              })
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
          {epochsCount})
        </button>
      </div>
    </div>
  );
}

function PassedIdentity({ identity, address, shortScoreTxt, longScoreTxt }) {
  return (
    <tr>
      <td>
        <div className="text_block text_block--ellipsis">
          <Link href="/epoch/[epoch]" as={`/epoch/${identity.epoch + 1}`}>
            <a>{epochFmt(identity.epoch + 1)}</a>
          </Link>
        </div>
      </td>
      <td>{identityStatusFmt(identity.prevState)}</td>
      <td>{identityStatusFmt(identity.state)}</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/rewards"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/rewards`}
        >
          <a>
            {identity.totalValidationReward * 1
              ? dnaFmt(identity.totalValidationReward, '')
              : 'Not paid'}
          </a>
        </Link>
      </td>
      <td>{shortScoreTxt}</td>
      <td>{longScoreTxt}</td>
      <td>Successful</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/validation"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/validation`}
        >
          <a>
            <i className="icon icon--thin_arrow_right" />
          </a>
        </Link>
      </td>
    </tr>
  );
}

function LateSubmission({ identity, address, shortScoreTxt, longScoreTxt }) {
  return (
    <tr>
      <td>
        <div className="text_block text_block--ellipsis">
          <Link href="/epoch/[epoch]" as={`/epoch/${identity.epoch + 1}`}>
            <a>{epochFmt(identity.epoch + 1)}</a>
          </Link>
        </div>
      </td>
      <td>{identityStatusFmt(identity.prevState)}</td>
      <td>{identityStatusFmt(identity.state)}</td>
      <td>-</td>
      <td>{shortScoreTxt}</td>
      <td>{longScoreTxt}</td>
      <td>Late submission</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/validation"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/validation`}
        >
          <a>
            <i className="icon icon--thin_arrow_right" />
          </a>
        </Link>
      </td>
    </tr>
  );
}

function WrongAnswers({ identity, address, shortScoreTxt, longScoreTxt }) {
  return (
    <tr>
      <td>
        <div className="text_block text_block--ellipsis">
          <Link href="/epoch/[epoch]" as={`/epoch/${identity.epoch + 1}`}>
            <a>{epochFmt(identity.epoch + 1)}</a>
          </Link>
        </div>
      </td>
      <td>{identityStatusFmt(identity.prevState)}</td>
      <td>{identityStatusFmt(identity.state)}</td>
      <td>-</td>
      <td>{shortScoreTxt}</td>
      <td>{longScoreTxt}</td>
      <td>Wrong answers</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/validation"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/validation`}
        >
          <a>
            <i className="icon icon--thin_arrow_right" />
          </a>
        </Link>
      </td>
    </tr>
  );
}

function NotAllowed({ identity, address }) {
  return (
    <tr>
      <td>
        <div className="text_block text_block--ellipsis">
          <Link href="/epoch/[epoch]" as={`/epoch/${identity.epoch + 1}`}>
            <a>{epochFmt(identity.epoch + 1)}</a>
          </Link>
        </div>
      </td>
      <td>{identityStatusFmt(identity.prevState)}</td>
      <td>{identityStatusFmt(identity.state)}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>Not allowed</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/validation"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/validation`}
        >
          <a>
            <i className="icon icon--thin_arrow_right" />
          </a>
        </Link>
      </td>
    </tr>
  );
}

function Missed({ identity, address }) {
  return (
    <tr>
      <td>
        <div className="text_block text_block--ellipsis">
          <Link href="/epoch/[epoch]" as={`/epoch/${identity.epoch + 1}`}>
            <a>{epochFmt(identity.epoch + 1)}</a>
          </Link>
        </div>
      </td>
      <td>{identityStatusFmt(identity.prevState)}</td>
      <td>{identityStatusFmt(identity.state)}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>Missed validation</td>
      <td>
        <Link
          href="/identity/[address]/epoch/[epoch]/validation"
          as={`/identity/${address}/epoch/${identity.epoch + 1}/validation`}
        >
          <a>
            <i className="icon icon--thin_arrow_right" />
          </a>
        </Link>
      </td>
    </tr>
  );
}
