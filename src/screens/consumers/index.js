import { Layout } from '../../@clik/comps/layout'
import List from './list/comps'
import Consumer from './consumer/comps'
import Router, { useRouter } from 'next/router'

export default ({ query }) => {
  const link = useRouter()
  console.log(link.query || {})
  return (
    <Layout title="Consumers Traffic Light">
      {!query.id ? (
        <List query={link.query || {}} />
      ) : (
        <Consumer query={link.query || {}} />
      )}
    </Layout>
  )
}
