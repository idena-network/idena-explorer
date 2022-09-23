import {useRouter} from 'next/router'
import Layout from '../../shared/components/layout'
import HardForkVoting from '../../screens/hardfork/components/hardforkvoting'

function HardFork() {
  const router = useRouter()
  const upgrade = router.query.upgrade || 0
  return (
    <Layout title="Hard fork activation status">
      <section className="section section_info">
        <HardForkVoting upgrade={upgrade} />
      </section>
    </Layout>
  )
}

export default HardFork
