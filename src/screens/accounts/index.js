import { Layout } from '../../@clik/comps/layout'
import List from './list/comps'

export default props => {
  return (
    <Layout maxWidth title="Accounts Management">
      <List {...props} />
    </Layout>
  )
}
