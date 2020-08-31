import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useQuery} from 'react-query'
import {useRouter} from 'next/router'
import Layout from '../../../../shared/components/layout'
import {
  getEpoch,
  getEpochIdentitiesCount,
  getEpochIdentitiesSummary,
  getEpochFlipWrongWordsSummary,
  getEpochFlipStatesSummary,
} from '../../../../shared/api'
import {epochFmt, dateFmt} from '../../../../shared/utils/utils'
import {useHashChange, useHash} from '../../../../shared/utils/useHashChange'
import Identities from '../../../../screens/epoch/validation/components/identities'
import TooltipText from '../../../../shared/components/tooltip'
import Flips from '../../../../screens/epoch/validation/components/flips'

const DEFAULT_TAB = '#validated'

function Validation() {
  const router = useRouter()
  const epoch = parseInt(router.query.epoch || 0)

  const fetchEpoch = (_, epoch) => getEpoch(epoch)

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const {data: epochData} = useQuery(epoch && ['epoch', epoch - 1], fetchEpoch)

  return (
    <Layout title={`Validation results for epoch ${epochFmt(epoch)}`}>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Validation results</h1>
          <h3 className="section_main__subtitle">
            for epoch <span>{epochFmt(epoch)}</span> on{' '}
            <span>{epochData && dateFmt(epochData.validationTime)}</span>
          </h3>
        </div>

        <div className="button-group">
          <Link href="/epoch/[epoch]" as={`/epoch/${epoch}`}>
            <a className="btn btn-secondary btn-small">
              <i className="icon icon--back" />
              <span>Back to epoch</span>
            </a>
          </Link>
        </div>
      </section>

      <ValidationData epoch={epoch - 1} />

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
                      <h3>Validated</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#killed'}
                      href="#killed"
                    >
                      <h3>Killed</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#wasted'}
                      href="#wasted"
                    >
                      <h3>Failed candidates</h3>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#suspended'}
                      href="#suspended"
                    >
                      <h3>Suspended</h3>
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
                  states={['Human', 'Verified', 'Newbie']}
                />
              </div>
            </TabPane>
            <TabPane tabId="#killed">
              <div className="card">
                <Identities
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#killed'}
                  states={['Undefined']}
                  prevStates={[
                    'Newbie',
                    'Verified',
                    'Human',
                    'Suspended',
                    'Zombie',
                  ]}
                />
              </div>
            </TabPane>
            <TabPane tabId="#wasted">
              <div className="card">
                <Identities
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#wasted'}
                  states={['Undefined']}
                  prevStates={['Candidate']}
                />
              </div>
            </TabPane>
            <TabPane tabId="#suspended">
              <div className="card">
                <Identities
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#suspended'}
                  states={['Suspended', 'Zombie']}
                />
              </div>
            </TabPane>
            <TabPane tabId="#flips">
              <div className="card">
                <Flips
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#flips'}
                />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function ValidationData({epoch}) {
  const {data: identitiesSummary} = useQuery(
    epoch && ['epoch/identitiesSummary', epoch],
    (_, epoch) => getEpochIdentitiesSummary(epoch)
  )

  const {data: flipStatesSummary} = useQuery(
    epoch && ['epoch/flipStatesSummary', epoch],
    (_, epoch) => getEpochFlipStatesSummary(epoch)
  )

  const {data: flipWrongWordsSummary} = useQuery(
    epoch && ['epoch/flipWrongWordsSummary', epoch],
    (_, epoch) => getEpochFlipWrongWordsSummary(epoch)
  )

  const {data: failedCandidates} = useQuery(
    epoch && ['epoch/identites/count', epoch, ['Undefined'], ['Candidate']],
    (_, epoch, states, prevStates) =>
      getEpochIdentitiesCount(epoch, states, prevStates)
  )

  const {data: failedIdentities} = useQuery(
    epoch && [
      'epoch/identites/count',
      epoch,
      ['Undefined'],
      ['Newbie', 'Verified', 'Human', 'Suspended', 'Zombie'],
    ],
    (_, epoch, states, prevStates) =>
      getEpochIdentitiesCount(epoch, states, prevStates)
  )

  const getCount = (src, state) =>
    (src.find((x) => x.value === state) || {count: 0}).count

  return (
    <section className="section section_info">
      <div className="row">
        <div className="col-12 col-sm-6">
          <h3>Identities</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {identitiesSummary
                      ? getCount(identitiesSummary, 'Human') +
                        getCount(identitiesSummary, 'Verified') +
                        getCount(identitiesSummary, 'Newbie')
                      : '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Successfully validated identities"
                  >
                    Total validated
                  </TooltipText>
                </div>
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {failedIdentities || '-'}
                    {' / '}
                    {failedCandidates || '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Killed identities / Failed candidates"
                  >
                    Killed
                  </TooltipText>
                </div>
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {identitiesSummary
                      ? getCount(identitiesSummary, 'Suspended') +
                        getCount(identitiesSummary, 'Zombie')
                      : '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Verified identities missed validation or submitted too late (Suspended/Zombie)"
                  >
                    Suspended
                  </TooltipText>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <h3>Flips</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="col-12 col-sm-3 bordered-col">
                  <h3 className="info_block__accent">
                    {(flipStatesSummary &&
                      getCount(flipStatesSummary, 'Qualified') +
                        getCount(flipStatesSummary, 'WeaklyQualified') +
                        getCount(flipStatesSummary, 'NotQualified')) ||
                      '-'}
                  </h3>
                  <div
                    className="control-label"
                    data-toggle="tooltip"
                    title="Total flips used for validation"
                  >
                    Total
                  </div>
                </div>
                <div className="col-12 col-sm-6 bordered-col">
                  <h3 className="info_block__accent">
                    {(flipStatesSummary &&
                      getCount(flipStatesSummary, 'Qualified')) ||
                      '-'}
                    {' / '}
                    {(flipStatesSummary &&
                      getCount(flipStatesSummary, 'WeaklyQualified')) ||
                      '-'}
                    {' / '}
                    {(flipStatesSummary &&
                      getCount(flipStatesSummary, 'NotQualified')) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Strong / Weak / No consensus"
                  >
                    Consensus
                  </TooltipText>
                </div>
                <div className="col-12 col-sm-3 bordered-col">
                  <h3 className="info_block__accent">
                    {(flipWrongWordsSummary &&
                      getCount(flipWrongWordsSummary, true)) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Bad flips irrelevant to keywords, having inappropriate content, labels on top of the images showing the right order or text needed to solve the flip"
                  >
                    Reported
                  </TooltipText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Validation
