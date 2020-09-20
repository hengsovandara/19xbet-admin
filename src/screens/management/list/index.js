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
      title: 'My Queue',
      key: 'assigned',
      active: !step || step === 'assigned',
      href: { query: { step: 'assigned' } },
      amount: 'assignedAssignments',
      component: () => <My { ...query} />
    },
    ['manager', 'admin'].includes(user.role) && {
      title: 'Assigned',
      key: 'team',
      active: step === 'processing',
      href: { query: { step: 'processing' } },
      amount: 'processingAssignments',
      component: () => <Processing { ...query } />
    },
    ['manager', 'admin', 'compliance'].includes(user.role) && {
      title: 'Team Queue',
      key: 'team',
      active: step === 'teamed',
      href: { query: { step: 'teamed' } },
      amount: 'teamedAssignments',
      component: () => <Teamed { ...query } />
    },
    ['manager', 'admin', 'associate'].includes(user.role) && {
      title: 'Outstanding Consumers',
      key: 'consumers',
      active: step === 'consumers',
      href: { query: { step: 'consumers' } },
      amount: 'unassignedConsumers',
      component: () => <Consumers { ...query} />
    },
    ['manager', 'admin', 'associate'].includes(user.role) && {
      title: 'Returned Consumers',
      key: 'consumers',
      active: step === 'requested',
      href: { query: { step: 'requested' } },
      amount: 'requestedConsumers',
      component: () => <Requested { ...query} />
    }
  ].filter(i => i)), [page, step, keywords, status])

  return <div className="p:24px bg:white">
    <Menu noBorder data={counts} items={items} />
  </div>
}

export default List
