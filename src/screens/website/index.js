import { Layout } from '../../@clik/comps/layout'
import List from './list'

const WebSiteScreen = ({ query }) => <Layout maxWidth>{
  !query.id ? <List query={query} /> : 
  <div />}</Layout>

export default WebSiteScreen