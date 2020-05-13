import Link from 'next/link';
import Layout from '../../shared/components/layout';
import { NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import {
  getIdentityAge,
  getOnlineStatus,
  getIdentity,
  getAddressInfo,
} from '../../shared/api';
import {
  dnaFmt,
  identityStatusFmt,
  dateTimeFmt,
  precise6,
} from '../../shared/utils/utils';
import { useQuery } from 'react-query';
import FlipsStatus from './components/flipsStatus';
import ValidationStatus from './components/validationStatus';
import Epochs from './components/epochs';
import Flips from './components/flips';
import Invites from './components/invites';
import { useHashChange, useHash } from '../../shared/utils/useHashChange';
import TooltipText from '../../shared/components/tooltip';

const DEFAULT_TAB = '#validations';

function Identity({ address = '' }) {
  const { hash, setHash, hashReady } = useHash();
  useHashChange((hash) => setHash(hash));

  const { data: addressInfo } = useQuery(['balance', address], (_, address) =>
    getAddressInfo(address)
  );

  const { data: identityInfo } = useQuery(['identity', address], (_, address) =>
    getIdentity(address)
  );

  const { data: onlineStatus } = useQuery(['online', address], (_, address) =>
    getOnlineStatus(address)
  );

  const { data: identityAge } = useQuery(['age', address], (_, address) =>
    getIdentityAge(address)
  );

  return (
    <Layout>
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={'https://robohash.org/' + address.toLowerCase()}
                alt="pic"
                width="160"
              />
              <div className="verified_sign">
                {identityInfo && identityInfo.state === 'Human' && (
                  <i className="icon icon--status"></i>
                )}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">{address}</h1>
            </div>

            <Link href="/address/[address]" as={`/address/${address}`}>
              <a className="btn btn-small btn-primary">
                <i className="icon icon--coins"></i>
                <span>Address details</span>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <IdentityData
        addressInfo={addressInfo}
        identityInfo={identityInfo}
        onlineStatus={onlineStatus}
        identityAge={identityAge}
      ></IdentityData>

      <section className="section section_info">
        <div className="row">
          <ValidationStatus identityInfo={identityInfo}></ValidationStatus>
          <FlipsStatus address={address}></FlipsStatus>
        </div>
      </section>

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
                      href="#validations"
                    >
                      <h3>Identity's validations</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#flips'}
                      href="#flips"
                    >
                      <h3>Created flips</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#invites'}
                      href="#invites"
                    >
                      <h3>Invites</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <Epochs
                  address={address}
                  visible={hashReady && (hash === DEFAULT_TAB || hash === '')}
                ></Epochs>
              </div>
            </TabPane>
            <TabPane tabId="#flips">
              <div className="card">
                <Flips
                  address={address}
                  visible={hashReady && hash === '#flips'}
                ></Flips>
              </div>
            </TabPane>
            <TabPane tabId="#invites">
              <div className="card">
                <Invites
                  address={address}
                  visible={hashReady && hash === '#invites'}
                ></Invites>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  );
}

function IdentityData({
  addressInfo,
  identityInfo,
  onlineStatus,
  identityAge,
}) {
  const onlineMiner =
    identityInfo &&
    (identityInfo.state === 'Newbie' ||
      identityInfo.state === 'Verified' ||
      identityInfo.state === 'Human');

  return (
    <>
      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Status:</div>
                <div className="text_block">
                  {(identityInfo && identityStatusFmt(identityInfo.state)) ||
                    '-'}
                </div>

                <div className={`onlineMiner ${onlineMiner ? '' : 'hidden'}`}>
                  <hr />
                  <div className="control-label">Online miner status:</div>
                  <div className="text_block">
                    {onlineStatus && onlineStatus.online ? 'On' : 'Off'}
                  </div>
                  <hr />
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="The time of the latest block issued / vote for a block issue"
                  >
                    Last seen:
                  </TooltipText>
                  <div className="text_block">
                    {(onlineStatus &&
                      onlineStatus.lastActivity &&
                      dateTimeFmt(onlineStatus.lastActivity)) ||
                      '-'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Age:</div>
                <div className="text_block">{identityAge}</div>

                <div className={`onlineMiner ${onlineMiner ? '' : 'hidden'}`}>
                  <hr />
                  <div className="control-label">Stake:</div>
                  <div className="text_block">
                    {(addressInfo && dnaFmt(precise6(addressInfo.stake))) ||
                      '-'}
                  </div>

                  <hr />
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Mining penalty left"
                  >
                    Mining penalty:
                  </TooltipText>
                  <div className="text_block">
                    {(onlineStatus &&
                      onlineStatus.penalty * 1 &&
                      dnaFmt(precise6(onlineStatus.penalty))) ||
                      '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Identity.getInitialProps = function ({ query }) {
  return { address: query.address };
};

export default Identity;
