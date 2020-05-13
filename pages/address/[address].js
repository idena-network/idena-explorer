import Link from 'next/link';
import Layout from '../../shared/components/layout';
import { NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { getEpochsCount, getIdentity, getAddressInfo } from '../../shared/api';
import { dnaFmt, identityStatusFmt } from '../../shared/utils/utils';
import Transactions from './components/transactions';
import { useQuery } from 'react-query';
import Rewards from './components/rewards';
import Penalties from './components/penalties';
import { useHash, useHashChange } from '../../shared/utils/useHashChange';
import TooltipText from '../../shared/components/tooltip';

const DEFAULT_TAB = '#transactions';

function Address({ address = '' }) {
  const { hash, setHash, hashReady } = useHash();
  useHashChange((hash) => setHash(hash));

  const { data: addressInfo } = useQuery(['balance', address], (_, address) =>
    getAddressInfo(address)
  );

  const { data: epochsCount } = useQuery(['epochs', address], (_, address) =>
    getEpochsCount(address)
  );

  const { data: identityInfo } = useQuery(
    epochsCount && ['identity', address],
    (_, address) => getIdentity(address)
  );

  return (
    <Layout>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Address</h1>
          <h3 className="section_main__subtitle">
            <span>{address}</span>
          </h3>
        </div>
      </section>

      <AddressData
        addressInfo={addressInfo}
        identityInfo={identityInfo}
      ></AddressData>

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
                      href={DEFAULT_TAB}
                    >
                      <h3>Transactions</h3>
                    </NavLink>
                  </NavItem>

                  {identityInfo && (
                    <>
                      <NavItem>
                        <NavLink
                          active={hashReady && hash === '#rewards'}
                          href="#rewards"
                        >
                          <h3>Rewards</h3>
                        </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink
                          active={hashReady && hash === '#penalty'}
                          href="#penalty"
                        >
                          <h3>Mining penalty</h3>
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <Transactions
                  address={address}
                  visible={hashReady && (hash === DEFAULT_TAB || !hash)}
                ></Transactions>
              </div>
            </TabPane>
            <TabPane tabId="#rewards">
              <div className="card">
                <Rewards
                  address={address}
                  visible={hashReady && hash === '#rewards'}
                ></Rewards>
              </div>
            </TabPane>
            <TabPane tabId="#penalty">
              <div className="card">
                <Penalties
                  address={address}
                  visible={hashReady && hash === '#penalty'}
                ></Penalties>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  );
}

function AddressData({ addressInfo, identityInfo }) {
  return (
    <>
      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-12">
            <h3>Details</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div
                    className={`col-12 ${
                      identityInfo ? 'col-sm-4' : 'col-sm-6'
                    } bordered-col`}
                  >
                    <h3 className="info_block__accent">
                      {(addressInfo && dnaFmt(addressInfo.balance)) || '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Available balance"
                    >
                      Balance
                    </TooltipText>
                  </div>
                  <div
                    className={`col-12 ${
                      identityInfo ? 'col-sm-4' : 'col-sm-6'
                    } bordered-col`}
                    style={{ display: identityInfo ? 'block' : 'none' }}
                  >
                    <h3 className="info_block__accent">
                      {(addressInfo && dnaFmt(addressInfo.stake)) || '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Frozen balance"
                    >
                      Stake
                    </TooltipText>
                  </div>
                  <div
                    className={`col-12 ${
                      identityInfo ? 'col-sm-4' : 'col-sm-6'
                    } bordered-col`}
                  >
                    <h3 className="info_block__accent">
                      {(addressInfo && addressInfo.txCount) || '-'}
                    </h3>
                    <div className="control-label">Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {identityInfo && (
        <section className="section section_details">
          <h3>Owner</h3>
          <div className="card">
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="section__group">
                  <div className="control-label">Identity:</div>
                  <div
                    className="text_block text_block--ellipsis"
                    style={{ width: '80%' }}
                  >
                    <Link
                      href="/identity/[address]"
                      as={`/identity/${identityInfo.address}`}
                    >
                      <a>
                        <img
                          className="user-pic"
                          width="32"
                          src={
                            'https://robohash.org/' +
                            identityInfo.address.toLowerCase()
                          }
                        ></img>
                        <span>{identityInfo.address}</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="section__group">
                  <div className="control-label">Status:</div>
                  <div className="text_block">
                    {identityStatusFmt(identityInfo.state)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

Address.getInitialProps = function ({ query }) {
  return { address: query.address };
};

export default Address;
