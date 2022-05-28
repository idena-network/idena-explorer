import {useQuery} from 'react-query'
import Link from 'next/link'
import {TabContent, TabPane, NavItem, NavLink} from 'reactstrap'
import {useRouter} from 'next/router'
import Layout from '../../../../shared/components/layout'
import {getEpoch, getEpochRewardsSummary} from '../../../../shared/api'
import {
  epochFmt,
  dateFmt,
  dnaFmt,
  precise0,
} from '../../../../shared/utils/utils'
import TooltipText from '../../../../shared/components/tooltip'
import Distribution from '../../../../screens/epoch/rewards/components/distribution'
import {useHash, useHashChange} from '../../../../shared/utils/useHashChange'
import Penalty from '../../../../screens/epoch/rewards/components/penalty'
import Ages from '../../../../screens/epoch/rewards/components/ages'
import Pools from '../../../../screens/epoch/rewards/components/pools'

const DEFAULT_TAB = '#ages'

function Rewards() {
  const router = useRouter()
  const epoch = parseInt(router.query.epoch || 0)

  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  const fetchEpoch = (_, epoch) => getEpoch(epoch)
  const {data: epochData} = useQuery(epoch && ['epoch', epoch - 1], fetchEpoch)

  return (
    <Layout title={`Rewards paid for epoch ${epochFmt(epoch)}`}>
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
                      active={hashReady && (hash === '#ages' || hash === '')}
                      href="#ages"
                    >
                      <h3>Rewards distribution</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#distribution'}
                      href="#distribution"
                    >
                      <h3>Rewarded identities</h3>
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

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#pools'}
                      href="#pools"
                    >
                      <h3>Pool's rewards</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId="#ages">
              <div className="card">
                <Ages
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#ages'}
                />
              </div>
            </TabPane>

            <TabPane tabId="#distribution">
              <div className="card">
                <Distribution
                  epoch={epoch - 1}
                  visible={
                    hashReady && (hash === '#distribution' || hash === '')
                  }
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

            <TabPane tabId="#pools">
              <div className="card">
                <Pools
                  epoch={epoch - 1}
                  visible={hashReady && hash === '#pools'}
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
    epoch && epoch >= 0 && ['epoch/rewardsSummary', epoch],
    (_, epoch) => getEpochRewardsSummary(epoch)
  )
  const validation =
    rewardsSummary && rewardsSummary.validation && rewardsSummary.validation > 0
  const staking =
    rewardsSummary && rewardsSummary.staking && rewardsSummary.staking > 0

  return (
    <section className="section section_info">
      <div className="row">
        <div className={`col-12 col-sm-${validation ? 4 : 3}`}>
          <h3>Reward fund, iDNA</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="bordered-col col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary &&
                      dnaFmt(precise0(rewardsSummary.total), '')) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Total reward fund (including the foundation reward and zero wallet)"
                  >
                    Total
                  </TooltipText>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`col-12 col-sm-${validation ? 8 : 9}`}>
          <h3>Rewards, iDNA</h3>
          <div className="card">
            <div className="info_block">
              <div className="row">
                <div className="bordered-col col">
                  <h3 className="info_block__accent">
                    {validation &&
                      dnaFmt(precise0(rewardsSummary.validation), '')}
                    {staking && dnaFmt(precise0(rewardsSummary.staking), '')}
                    {!validation && !staking && '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip={
                      validation
                        ? 'Fund for successful validation'
                        : staking
                        ? 'Fund for quadratic staking'
                        : ''
                    }
                  >
                    {validation ? 'Validation' : staking ? 'Staking' : '-'}
                  </TooltipText>
                </div>
                {staking && (
                  <div className="bordered-col col">
                    <h3 className="info_block__accent">
                      {(rewardsSummary &&
                        dnaFmt(precise0(rewardsSummary.candidate), '')) ||
                        '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Fund for the first successful validation"
                    >
                      Candidates
                    </TooltipText>
                  </div>
                )}
                <div className="bordered-col col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary &&
                      dnaFmt(precise0(rewardsSummary.flips), '')) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for qualified flips"
                  >
                    Flips
                  </TooltipText>
                </div>
                <div className="bordered-col col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary &&
                      dnaFmt(precise0(rewardsSummary.invitations), '')) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for validated invitations"
                  >
                    Invitations
                  </TooltipText>
                </div>
                <div className="bordered-col col">
                  <h3 className="info_block__accent">
                    {(rewardsSummary &&
                      dnaFmt(precise0(rewardsSummary.reports), '')) ||
                      '-'}
                  </h3>
                  <TooltipText
                    className="control-label"
                    data-toggle="tooltip"
                    tooltip="Fund for reports"
                  >
                    Reports
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

export default Rewards
