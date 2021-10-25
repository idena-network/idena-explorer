import Link from 'next/link'
import Layout from '../../shared/components/layout'
import TooltipText from '../../shared/components/tooltip'

const charts = [
  {
    title: 'Network Stats',
    charts: [
      {
        title: 'Active Miners',
        ref: '/charts/miners',
        img: '/static/images/charts/miners.png',
        tooltip:
          'Total number of actively mining identities running their own mining nodes or delegated into mining pools',
      },
      {
        title: 'Mining Nodes',
        ref: '/charts/validators',
        img: '/static/images/charts/validators.png',
        tooltip:
          'Total number of mining nodes run by individual identities or pool owners who activated online status',
      },
      {
        title: 'Full Nodes',
        ref: '/charts/peers',
        img: '/static/images/charts/peers.png',
        tooltip: 'Number of nodes discovered in the network',
      },
      {
        title: 'Transactions',
        ref: '/charts/transactions',
        img: '/static/images/charts/transactions.png',
        tooltip: 'Number of transactions by days',
      },
      {
        title: 'Invites Activation Progress',
        ref: '/charts/inviteactivations',
        img: '/static/images/charts/inviteactivations.png',
        tooltip: 'Total number of activated invitations',
      },
    ],
  },
  {
    title: 'Identities',
    charts: [
      {
        title: 'Validated Identities',
        ref: '/charts/identities',
        img: '/static/images/charts/totalidentities.png',
        tooltip: 'Total number of validated identities by epochs',
      },
      {
        title: 'Identities By Status',
        ref: '/charts/identitiesbystatus',
        img: '/static/images/charts/identities.png',
        tooltip: 'Breakdown of identities by their statuses by epochs',
      },
      {
        title: 'Newcomers',
        ref: '/charts/newcomers',
        img: '/static/images/charts/newcomers.png',
        tooltip: 'Number of identities that validated for the first time',
      },
      {
        title: 'Validation Success Ratio',
        ref: '/charts/successratio',
        img: '/static/images/charts/successratio.png',
        tooltip:
          'Number of validated identities divided by number of validation participants',
      },
    ],
  },
  {
    title: 'Coins',
    charts: [
      {
        title: 'Supply Structure',
        ref: '/circulation',
        img: '/static/images/charts/supplystructure.png',
        tooltip: 'Total supply structure',
      },
      {
        title: 'Circulating Supply',
        ref: '/charts/circulatingsupply',
        img: '/static/images/charts/circulatingsupply.png',
        tooltip: 'Total amount of iDNA coins available for trade',
      },
      {
        title: 'Burnt',
        ref: '/charts/burnt',
        img: '/static/images/charts/burnt.png',
        tooltip: 'Total amount of iDNA coins burnt by protocol',
      },
      {
        title: 'Staked',
        ref: '/charts/staked',
        img: '/static/images/charts/staked.png',
        tooltip: 'Total amount of iDNA coins locked in identities stakes',
      },
      {
        title: 'Vested',
        ref: '/charts/vested',
        img: '/static/images/charts/vested.png',
        tooltip: 'Total amount of vested iDNA coins',
      },

      {
        title: 'Total Supply',
        ref: '/charts/totalsupply',
        img: '/static/images/charts/totalsupply.png',
        tooltip: 'Total supply structure, dynamics',
      },
    ],
  },
]

function Charts() {
  return (
    <Layout title="Chart and Statistics">
      {charts.map((section, sectionId) => (
        <section className="section section_info" key={sectionId}>
          <h1>{section.title}</h1>
          <div className="card">
            <div className="info_block">
              <div className="row">
                {section.charts.map((chart, chartId) => (
                  <div className="col-12 col-sm-3 " key={chartId}>
                    <Link href={chart.ref}>
                      <a className="link-col">
                        <h3 className="info_block__accent">
                          {chart.img && <img src={chart.img} alt="pic" />}
                        </h3>
                        <TooltipText
                          className="control-label"
                          data-toggle={chart.tooltip ? 'tooltip' : ''}
                          tooltip={chart.tooltip}
                        >
                          {chart.title}
                        </TooltipText>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <h1>More stats</h1>
      <div className="control-label">
        <p className="section_main__subtitle">
          Check out more stats developed by Idena community members at{' '}
          <a href="https://idena.today" target="_blank" rel="noreferrer">
            idena.today &rsaquo;
          </a>
        </p>
      </div>
    </Layout>
  )
}

export default Charts
