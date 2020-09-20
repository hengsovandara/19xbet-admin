import React, { useEffect, useState, useRef } from 'react'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import Agent from './agent'

const List = ({ query }) => {
  const { step, page, keywords, status } = query || {}

  const items = React.useMemo(() => ([
    {
      title: 'AGENT',
      key: 'agent',
      active: !step || step === 'agent',
      href: { query: { step: 'agent' } },
      component: () => <Agent { ...query} />
    },
  ].filter(i => i)), [page, step, keywords, status])

  return <div className="p:24px bg:white">
    <Menu noBorder items={items} />
  </div>
}

export default List
