import {useQuery} from 'react-query'
import Link from 'next/link'
import {TabContent, TabPane, NavItem, NavLink} from 'reactstrap'
import Layout from '../../../../shared/components/layout'
import {getEpoch, getEpochRewardsSummary} from '../../../../shared/api'
import {epochFmt, dateFmt, dnaFmt} from '../../../../shared/utils/utils'
import TooltipText from '../../../../shared/components/tooltip'
import Distribution from './components/distribution'
import {useHash, useHashChange} from '../../../../shared/utils/useHashChange'
import Penalty from './components/penalty'

const DEFAULT_TAB = '#distribution'

function Rewards({epoch}) {
  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const fetchEpoch = (_, epoch) => getEpoch(epoch)

  // eslint-disable-next-line no-param-reassign
  epoch = parseInt(epoch)

  const {data: epochData} = useQuery(['epoch', epoch - 1], fetchEpoch)

  return (
    <Layout>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">Rewards paid</h1>
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

      <RewardsData epoch={epoch - 1} />

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
                      <h3>Rewards distribution</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#penalty'}
                      href="#penalty"
                    >
                      <h3>Penalized identities</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <Distribution
                  epoch={epoch - 1}
                  visible={hashReady && (hash === DEFAULT_TAB || hash === '')}
                />
              </div>
            </TabPane>

            <TabPane tabId="#penalty">
              <div className="card">
                <Penalty
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#penalty'}
                />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function RewardsData({epoch}) {
  const {data: rewardsSummary} = useQuery(
    ['epoch/rewardsSummary', epoch],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )

  return (
    <section className="section section_info">
      <div className="row">
        <div className="col-12 col-sm-4">
          <h3>Total reward fund</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="col-12 col-sm-12 bordered-col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary && dnaFmt(rewardsSummary.total)) || '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total reward fund (including the fundation reward and zero wallet)"
                  >
                    Total
                  </TooltipText>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-8">
          <h3>Rewards</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary && dnaFmt(rewardsSummary.validation)) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for succesfull validation"
                  >
                    Validation rewards
                  </TooltipText>
                </div>
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary && dnaFmt(rewardsSummary.flips)) || '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for qualified flips"
                  >
                    Flips rewards
                  </TooltipText>
                </div>
                <div className="col-12 col-sm-4 bordered-col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary && dnaFmt(rewardsSummary.invitations)) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for validated invitations"
                  >
                    Invitations rewards
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

Rewards.getInitialProps = function ({query}) {
  return {epoch: query.epoch}
}

export default Rewards
