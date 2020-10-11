import { Layout } from 'clik/comps/layout'
import List from './list'
import User from './user'
import Router, { useRouter } from 'next/router'
import useActStore from 'actstore'

const Staff = ({ query }) => {
  const { store: { ready } } = useActStore({}, ['ready'])
  const router = useRouter()

  return !query.id ?
    <Layout maxWidth onBack={() => router.back()}>
      { ready ? <List query={query || {}} /> : null }
    </Layout>
    : <Layout maxWidth onBack={() => router.back()}>
      { ready ? <User query={query || {}} /> : null }
    </Layout>
}

export default Staff
