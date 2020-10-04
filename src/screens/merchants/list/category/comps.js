import { useEffect, useState, useRef, useMemo } from 'react'
import { fucss } from 'next-fucss/utils'
import Router from 'next/router'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import Photo from 'clik/elems/photo'
import Button from 'clik/elems/button'

import { actions } from './hooks'

export default ({ step, subStep }) => {
  const { act, store, cookies, action } = useActStore(actions)
  let photoMethods = useRef(null)
  const { socket, merchants, categories } = store.get('socket', 'merchants', 'merchantsCount', 'categories')
  const [isRefresh, setIsFresh] = useState(false)

  // useEffect(() => {

  // }, [])
  
  const items = useMemo(() => ([
    {
      title: 'News',
      key: 'news',
      active: !subStep || subStep === 'news',
      href: { query: { step: 'categories', subStep: 'news' } },
      component: () => <div />
    },
    {
      title: 'Sports',
      key: 'sports',
      active: subStep === 'sports',
      href: { query: { step: 'categories', subStep: 'sports' } },
      component: () => <div />
    },
    {
      title: 'Casino',
      key: 'casino',
      active: subStep === 'casino',
      href: { query: { step: 'categories', subStep: 'casino' } },
      component: () => <div />
    },
    {
      title: 'Fish',
      key: 'fish',
      active: subStep === 'fish',
      href: { query: { step: 'categories', subStep: 'fish' } },
      component: () => <div />
    },
    {
      title: 'Paper',
      key: 'paper',
      active: subStep === 'paper',
      href: { query: { step: 'categories', subStep: 'paper' } },
      component: () => <div />
    },
    {
      title: 'Roaster',
      key: 'roaster',
      active: subStep === 'roaster',
      href: { query: { step: 'categories', subStep: 'roaster' } },
      component: () => <div />
    }
    ,
    {
      title: 'Promotion',
      key: 'promotion',
      active: subStep === 'promotion',
      href: { query: { step: 'categories', subStep: 'promotion' } },
      component: () => <div />
    }
  ]), [{subStep}])

  useEffect(() => {
    cookies.get('token') && act('CATEGORIES_SUB')
  }, [socket])

  if (!categories)
    return <p className="c:black p:24px">Loading...</p>

  return (
    <div className="c:black200 p-tb:10px">
      <Menu noBorder items={items} titleStyle={"fs:15px"}/>
    </div>
  )
}

const Elems = ({items =[], title}) => {
  const { act } = useActStore(actions)
  let photoMethods = useRef(null)

  const deleteBanner = async (banner) => {
    await act('CATEGORIES_DELETE', banner)
    // alert(JSON.stringify(banner, 0, 2))
  } 

  return (
    <div className="p-b:10px">
      <div className="dp:flex ai:c">
        <h2 className="" >{title}</h2>
        <Button
          bordered
          green
          icon={'plus'}
          action={() => photoMethods.current.handleToggleShow()}
          className="p-r:0 m-rl:15px"
        />
      </div>
      {
        (items).map((item, index) => 
          <div>
            <div className="dp:flex ai:c p-t:15px">
              <h3 className="" >{`${item?.name?.toUpperCase()} ` + 'Banner ' + (index + 1)}</h3>
              <div className="dp:flex">
                <Button
                  bordered
                  green
                  icon={'edit'}
                  action={() => {}}
                  className="p-r:0 m-rl:15px"
                />
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