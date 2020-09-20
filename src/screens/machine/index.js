import { Layout } from '../../@clik/comps/layout'
import List from './list/comps'

export default props => {
  return (
    <Layout title="Machine Learning">
      <List {...props} />
    </Layout>
  )
}
