import Layout from '../../../shared/components/layout'
import MinersHistory from '../../../screens/charts/components/miners'

function Miners() {
  return (
    <Layout title="Full Mining Nodes Chart">
      <section className="section section_info">
        <h1>Full mining nodes and Miners</h1>
        <div className="card">
          <div className="row">
            <p className="control-label">
              Full mining nodes: individual identities and pool owners activated
              online status and running their full mining nodes. <br />
              Miners: individual identities activated online status and
              identities included into mining pools.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="info_block">
            <div className="row">
              <MinersHistory />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Miners
