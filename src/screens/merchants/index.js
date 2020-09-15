import { Layout } from '../../@clik/comps/layout'
import List from './list/comps'
import Merchant from './merchant/comps'

export default ({ query }) => <Layout title="Merchants Traffic Light">{!query.id ? <List query={query} /> : <Merchant query={query} />}</Layout>
