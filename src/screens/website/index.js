import { Layout } from '../../@clik/comps/layout'
import List from './list'
import Merchant from './merchant/comps'

const MerchantScreen = ({ query }) => <Layout maxWidth>{
  !query.id ? <List query={query} /> : 
  <Merchant query={query} />}</Layout>

export default MerchantScreen