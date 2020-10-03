import { useEffect, useState, useRef } from 'react'
import { fucss } from 'next-fucss/utils'
import Router from 'next/router'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import Photo from 'clik/elems/photo'

import { actions } from './hooks'

export default ({ query }) => {
  const { act, store, cookies, action } = useActStore(actions)
  let photoMethods = useRef(null)
  const { socket, merchants, categories, dashboards, informations } = store.get('socket', 'merchants', 'merchantsCount', 'dashboards', 'categories', 'informations')

  useEffect(() => {
    cookies.get('token') && act('MERCHANTS_SUB')
  }, [socket])

  if (!categories && !dashboards && !informations)
    return <p className="c:black p:24px">Loading...</p>

  return (
    <div className="c:black200 p-tb:24px">
      <Elems items={categories} title='Dashboards' />
    </div>
  )
}

const Elems = ({items =[], title}) => {

  return (
    <div className="p-b:10px">
      <h2 className="as:fs" >{title}</h2>
      {
        (items).map(item => 
          <img src={item.banner} className={classNameImage(false)} onClick={e => {}} />
        )
      }
    </div>
  )
}

const classNameImage = light =>
  fucss({
    'h:175px m:5px-5px-0-0 hv-bs:2 ts:all m-b:10px': true,
    'bd:1px-sld-grey200': !light
  })