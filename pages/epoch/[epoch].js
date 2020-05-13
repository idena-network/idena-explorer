import Link from 'next/link';
import Layout from '../../shared/components/layout';
import { NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { useQuery } from 'react-query';
import {
  getLastEpoch,
  getEpoch,
  getEpochIdentitiesCount,
  getEpochTransactionsCount,
  getEpochBlocksCount,
  getEpochFlipsCount,
  getEpochInvitesSummary,
} from '../../shared/api';
import { epochFmt, dateTimeFmt } from '../../shared/utils/utils';
import Identities from './components/identities';
import Invitations from './components/invitations';
import Flips from './components/flips';
import { useHashChange, useHash } from '../../shared/utils/useHashChange';
import Blocks from './components/blocks';
import Transactions from './components/transactions';

const DEFAULT_TAB = '#identities';

function Epoch({ epoch }) {
  const fetchEpoch = (_, epoch) => getEpoch(epoch);

  const { hash, setHash, hashReady } = useHash();
  useHashChange((hash) => setHash(hash));

  epoch = parseInt(epoch);

  const { data: lastEpoch } = useQuery('last-epoch', getLastEpoch);
  const { data: epochData } = useQuery(['epoch', epoch - 1], fetchEpoch);
  const { data: nextEpochData } = useQuery(['epoch', epoch], fetchEpoch);

  return (
    <Layout>
      <section className="section">
        <h1>Epoch</h1>

        <div className="button-group">
          <Link href="/epoch/[epoch]" as={`/epoch/${epoch - 1}${hash}`}>
            <a className="btn btn-secondary btn-small" disabled={epoch === 1}>
              <i className="icon icon--thin_arrow_left"></i>
              <span>Previous epoch</span>
            </a>
          </Link>

          <Link href="/epoch/[epoch]" as={`/epoch/${epoch + 1}${hash}`}>
            <a
              className="btn btn-secondary btn-small"
              disabled={!lastEpoch || epoch === lastEpoch.epoch}
            >
              <span>Next epoch</span>
              <i className="icon icon--thin_arrow_right"></i>
            </a>
          </Link>

          <Link
            href="/epoch/[epoch]/validation"
            as={`/epoch/${epoch}/validation`}
          >
            <a className="btn btn-secondary btn-small">
              <i className="icon icon--report"></i>
              <span>Validation results</span>
            </a>
          </Link>

          <Link href="/epoch/[epoch]/rewards" as={`/epoch/${epoch}/rewards`}>
            <a className="btn btn-small btn-secondary">
              <i className="icon icon--coins"></i>
              <span>Rewards</span>
            </a>
          </Link>
        </div>
      </section>

      <EpochDetails
        epochData={epochData}
        nextEpochData={nextEpochData}
        lastEpoch={lastEpoch}
      ></EpochDetails>
      <EpochData epoch={epoch}></EpochData>

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink
                      active={
                        hashReady && (hash === DEFAULT_TAB || hash === '')
                      }
                      href="#identities"
                    >
                      <h3>Identities</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#invites'}
                      href="#invites"
                    >
                      <h3>Invitations</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#flips'}
                      href="#flips"
                    >
                      <h3>Flips</h3>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#blocks'}
                      href="#blocks"
                    >
                      <h3>Blocks</h3>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#transactions'}
                      href="#transactions"
                    >
                      <h3>Transactions</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <Identities
                  epoch={epoch - 1}
                  visible={hashReady && (hash === DEFAULT_TAB || hash === '')}
                />
              </div>
            </TabPane>
            <TabPane tabId="#invites">
              <div className="card">
                <Invitations
                  epoch={epoch}
                  visible={hashReady && hash === '#invites'}
                />
              </div>
            </TabPane>
            <TabPane tabId="#flips">
              <div className="card">
                <Flips epoch={epoch} visible={hashReady && hash === '#flips'} />
              </div>
            </TabPane>
            <TabPane tabId="#blocks">
              <div className="card">
                <Blocks
                  epoch={epoch}
                  visible={hashReady && hash === '#blocks'}
                />
              </div>
            </TabPane>
            <TabPane tabId="#transactions">
              <div className="card">
                <Transactions
                  epoch={epoch}
                  visible={hashReady && hash === '#transactions'}
                />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  );
}

function EpochDetails({ epochData, nextEpochData, lastEpoch }) {
  return (
    <section className="section section_details">
      <h3>Details</h3>
      <div className="card">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Epoch number:</div>
              <div className="text_block text_block--break">
                {(nextEpochData && epochFmt(nextEpochData.epoch)) || '-'}
              </div>
              <hr />
              <div className="control-label">Validation block height:</div>
              <div className="text_block">
                {(epochData && epochData.validationFirstBlockHeight) || '-'}
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="section__group">
              <div className="control-label">Start:</div>
              <div className="text_block">
                {(epochData && dateTimeFmt(epochData.validationTime)) || '-'}
              </div>
              <hr />
              <div className="control-label">
                {nextEpochData &&
                lastEpoch &&
                lastEpoch.epoch === nextEpochData.epoch
                  ? 'Next validation:'
                  : 'End:'}
              </div>
              <div className="text_block">
                {(nextEpochData && dateTimeFmt(nextEpochData.validationTime)) ||
                  '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EpochData({ epoch }) {
  const { data: txsCount } = useQuery(['epoch/txsCount', epoch], (_, epoch) =>
    getEpochTransactionsCount(epoch)
  );

  const { data: blocksCount } = useQuery(
    ['epoch/blocksCount', epoch],
    (_, epoch) => getEpochBlocksCount(epoch)
  );

  const { data: flipsCount } = useQuery(
    ['epoch/flipsCount', epoch],
    (_, epoch) => getEpochFlipsCount(epoch)
  );

  const { data: invitesSummary } = useQuery(
    ['epoch/invitesSummary', epoch],
    (_, epoch) => getEpochInvitesSummary(epoch)
  );

  const { data: identitiesCount } = useQuery(
    ['epoch/identites/count', epoch - 1],
    (_, epoch) => getEpochIdentitiesCount(epoch)
  );

  return (
    <section className="section section_details">
      <h3>Epoch data</h3>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-3 bordered-col">
              <h3 className="info_block__accent">{identitiesCount || '-'}</h3>
              <div className="control-label">Identities</div>
            </div>
            <div className="col-12 col-sm-3 bordered-col">
              <h3 className="info_block__accent">
                {txsCount || '-'} / {blocksCount || '-'}
              </h3>
              <div
                className="control-label"
                data-toggle="tooltip"
                title="Total transactions / Blocks"
              >
                Transactions / Blocks
              </div>
            </div>
            <div className="col-12 col-sm-3 bordered-col">
              <h3 className="info_block__accent">
                {(invitesSummary && invitesSummary.usedCount) || '-'} /{' '}
                {(invitesSummary && invitesSummary.allCount) || '-'}
              </h3>
              <div
                className="control-label"
                data-toggle="tooltip"
                title="Activated / Total issued"
              >
                Invitations
              </div>
            </div>
            <div className="col-12 col-sm-3 bordered-col">
              <h3 className="info_block__accent">{flipsCount || '-'}</h3>
              <div className="control-label">Flips created</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Epoch.getInitialProps = function ({ query }) {
  return { epoch: query.epoch };
};

export default Epoch;
