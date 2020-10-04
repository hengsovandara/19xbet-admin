import { useEffect, useState, useRef } from 'react'
import { fucss } from 'next-fucss/utils'
import useActStore from 'actstore'
import Button from 'clik/elems/button'

import { actions } from './hooks'

export default ({ query }) => {
  const { act, store, cookies, action } = useActStore(actions)
  let photoMethods = useRef(null)
  const { socket, merchants, dashboards } = store.get('socket', 'merchants', 'merchantsCount', 'dashboards', 'categories', 'informations')

  useEffect(() => {
    cookies.get('token') && act('MERCHANTS_SUB')
  }, [socket])

  if (!dashboards)
    return <p className="c:black p:24px">Loading...</p>

  return (
    <div className="c:black200 p-tb:24px">
      <Elems items={dashboards} title='Dashboards' />
    </div>
  )
}

const Elems = ({items =[], title}) => {
  const { act } = useActStore(actions)
  let photoMethods = useRef(null)

  const deleteBanner = async (banner) => {
    await act('DASHBOARD_DELETE', banner)
    // alert(JSON.stringify(banner, 0, 2))
  }

  const uploadImage = async(file) => {
    await act('DASHBOARD_CREATE', {file, type: 'dashboard'})
  }

  return (
    <div className="p-b:10px">
      <div className="dp:flex ai:c">
        <h2 className="" >{title}</h2>
        <Button
          bordered
          green
          icon={'plus'}
          type="file"
          action={uploadImage}
          className="p-r:0 m-rl:15px"
        />
      </div>
      {
        (items).map((item, index) => 
          <div>
            <div className="dp:flex ai:c p-t:15px">
              <h3 className="" >{'Banner ' + (index + 1)}</h3>
              <div className="dp:flex">
                {/* <Button
                  bordered
                  green
                  icon={'edit'}
                  action={() => {}}
                  className="p-r:0 m-rl:15px"
                /> */}
                <Button
                  bordered
                  red
                  icon={'trash'}
                  action={() => deleteBanner(item)}
                  className="p-r:0 m-rl:15px"
                />
              </div>
            </div>
            <div className="dp:flex ai:c">
              <img src={item.banner} className={classNameImage(false)} onClick={e => {}} />
            </div>
          </div>
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