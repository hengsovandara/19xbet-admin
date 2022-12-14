import { useEffect, useState, useRef, useMemo } from 'react'
import { fucss } from 'next-fucss/utils'
import Router from 'next/router'
import useActStore from 'actstore'
import Menu from 'clik/elems/menu'
import Button from 'clik/elems/button'

import { actions } from '../hooks'

const Categories = ({ step, subStep }) => {
  const { act, store, cookies, action } = useActStore(actions)
  let photoMethods = useRef(null)
  const { socket, merchants, categories = {} } = store.get('socket', 'merchants', 'merchantsCount', 'categories')

  useEffect(() => {
    cookies.get('token') && act('CATEGORIES_FETCH')
  }, [socket, subStep])

  const items = React.useMemo(() => ([
    {
      title: 'News',
      key: 'news',
      active: !subStep || subStep === 'news',
      href: { query: { step: 'categories', subStep: 'news' } },
      component: () => <Elems items={categories['news']} type="news"/>
    },
    {
      title: 'Sports',
      key: 'sports',
      active: subStep === 'sports',
      href: { query: { step: 'categories', subStep: 'sports' } },
      component: () => <Elems items={categories['sports']} type="sports"/>
    },
    {
      title: 'Casino',
      key: 'casino',
      active: subStep === 'casino',
      href: { query: { step: 'categories', subStep: 'casino' } },
      component: () => <Elems items={categories['casino']} type="casino"/>
    },
    {
      title: 'Fish',
      key: 'fish',
      active: subStep === 'fish',
      href: { query: { step: 'categories', subStep: 'fish' } },
      component: () => <Elems items={categories['fish']} type="fish"/>
    },
    {
      title: 'Paper',
      key: 'paper',
      active: subStep === 'paper',
      href: { query: { step: 'categories', subStep: 'paper' } },
      component: () => <Elems items={categories['paper']} type="paper"/>
    },
    {
      title: 'Roaster',
      key: 'roaster',
      active: subStep === 'roaster',
      href: { query: { step: 'categories', subStep: 'roaster' } },
      component: () => <Elems items={categories['roaster']} type="roaster"/>
    }
    ,
    {
      title: 'Promotion',
      key: 'promotion',
      active: subStep === 'promotion',
      href: { query: { step: 'categories', subStep: 'promotion' } },
      component: () => <Elems items={categories['promotion']} type="promotion"/>
    }
  ]), [subStep, categories])

  if (!categories)
    return <p className="c:black p:24px">Loading...</p>

  return (
    <div className="c:black200 p-tb:10px">
      <Menu noBorder items={items} titleStyle={"fs:15px"}/>
    </div>
  )
}

const Elems = ({items =[], type}) => {
  const { act } = useActStore(actions)

  const deleteBanner = async (banner) => {
    try {
      await act('CATEGORIES_DELETE', banner)
    } catch (error) {
      console.log("CATEGORIES_DELETE",error)
    }
  } 

  const createBanner = async (file) => {
    await act('CATEGORIES_CREATE', {file, type})
  }

  return (
    <div className="p-b:10px">
      <div className="dp:flex ai:c p-t:15px">
        <h3 className="" >ADD NEW BANNER</h3>
        <Button bordered green icon={'plus'} type="file"
          action={createBanner}
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

export default Categories