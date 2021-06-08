import Layout from '../../shared/components/layout'
import HardForkVoting from '../../screens/hardfork/components/hardforkvoting'

function HardFork() {
  return (
    <Layout title="Hard fork activation status">
      <section className="section section_info">
        <HardForkVoting />
      </section>
    </Layout>
  )
}

export default HardFork
