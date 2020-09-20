import React from 'react'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import My from './my'
import Consumers from './consumers'
import Processing from './processing'
import Teamed from './teamed'
import Requested from './requested'

const List = ({ query }) => {
  const { step, page, keywords, status } = query || {}
  const { store: { counts, user } } = useActStore({}, ['counts'])

  const items = React.useMemo(() => ([
    {
      title: 'របាយការណ៍',
      key: 'assigned',
      active: !step || step === 'assigned',
      href: { query: { step: 'assigned' } },
      amount: 'assignedAssignments',
      component: () => <My { ...query} />
    }
  ].filter(i => i)), [page, step, keywords, status])

  return <div className="p:24px bg:white">
    <Menu noBorder data={counts} items={items} />
  </div>
}

export default List
