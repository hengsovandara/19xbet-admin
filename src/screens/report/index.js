import { Layout } from 'clik/comps/layout'
import List from './list'
import React from 'react'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'

const Report = ({ query }) => {
  const { step, page, keywords, status } = query || {}
  const { store: { counts, user, ready } } = useActStore({}, ['counts'])

  const items = React.useMemo(() => ([
    {
      title: 'របាយការណ៍',
      key: 'assigned',
      active: !step || step === 'assigned',
      href: { query: { step: 'assigned' } },
      amount: 'assignedAssignments',
      component: () => <List { ...query} />
    }
  ].filter(i => i)), [page, step, keywords, status])

  return <Layout maxWidth>
    {!!ready && <div className="p:24px bg:white">
      <Menu noBorder data={counts} items={items} />
    </div>}
  </Layout>
}

export default Report
