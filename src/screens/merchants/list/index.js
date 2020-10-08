import React from 'react'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import Dashboard from './dashboard/comps'
import Category from './category/comps'
import Information from './information/comps'

const List = ({ query }) => {
  const { step, subStep } = query || {}
  const { store: { counts, user } } = useActStore({}, ['counts'])
  console.log({step})
  const items = React.useMemo(() => ([
    {
      title: 'Dashboard',
      key: 'dashboard',
      active: !step || step === 'dashboard',
      href: { query: { step: 'dashboard' } },
      component: () => <Dashboard { ...query} />
    },
    {
      title: 'categories',
      key: 'categories',
      active: step === 'categories',
      href: { query: { step: 'categories' } },
      component: () => <Category { ...query} />
    },
    {
      title: 'information',
      key: 'information',
      active: step === 'information',
      href: { query: { step: 'information' } },
      component: () => <Information { ...query} />
    }
  ].filter(i => i)), [step, subStep])

  return <div className="p-rl:24px bg:white">
    <Menu noBorder data={counts} items={items} />
  </div>
}

export default List
