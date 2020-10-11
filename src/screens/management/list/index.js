import React from 'react'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import My from './my'

const List = ({ query }) => {
  const { step, page, keywords, status } = query || {}
  const { store: { counts, user } } = useActStore({}, ['counts'])

  const items = React.useMemo(() => ([
    {
      title: 'ការគ្រប់គ្រង',
      key: 'all',
      active: !step || step === 'all',
      component: () => <My { ...query} />
    }
  ].filter(i => i)), [page, step, keywords, status])

  return <div className="p:24px bg:white">
    <Menu noBorder data={counts} items={items} />
  </div>
}

export default List
