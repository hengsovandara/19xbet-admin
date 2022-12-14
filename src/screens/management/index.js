import { Layout } from 'clik/comps/layout'
import List from './list'
import Consumer from './consumer'
import Router, { useRouter } from 'next/router'
import useActStore from 'actstore'

const Management = ({ query }) => {
  const { store: { ready } } = useActStore({}, ['ready'])
  return <Layout maxWidth>
    {!!ready && <List query={query || {}} />}
  </Layout>
}

export default Management
