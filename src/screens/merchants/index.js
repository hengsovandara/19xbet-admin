import { Layout } from '../../@clik/comps/layout'
import List from './list'
import Merchant from './merchant/comps'

export default ({ query }) => <Layout maxWidth>{
  !query.id ? <List query={query} /> : 
  <Merchant query={query} />}</Layout>
