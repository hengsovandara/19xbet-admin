import React, { useState, useEffect, useRef } from 'react'
import { fucss } from 'next-fucss/utils'
import ElemMeta from './meta'
import ElemNav from './nav'
import ElemHeader from './header'
import { ElemFog, ElemPopup, ElemInfo, ElemConfirm, ElemError, ElemLoading } from './fillers'
import Photo from '../elems/photo'
import useActStore from 'actstore'

const Layout = props => {
  const { breadcrumbs, children, empty, fullScreen, light = true, nospace, maxWidth, title = 'Traffic Light', wrap = true } = props

  const actStore = useActStore() || {}
  const {
    init = {},
    act,
    action = console.log,
    handle = {},
    store,
    status,
    store: { user }
  } = actStore

  let photoMethods = useRef(null)

  const INITIAL_STATE = {
    showNav: !empty && true,
    showNotifications: false
  }
  const [state, setState] = useState(INITIAL_STATE)
  const { showNav, showNotifications } = state

  const isLoading = props.isLoading || (status && status.loading)
  const error = props.error || status && status.error
  const info = props.info || (status && status.info)
  const confirm = props.confirm || (status && status.confirm)
  const isResponse = status && status.response
  const statusCode = status && status.resCode
  // const isReady     = store.get('ready')

  useEffect(() => {
    act('APP_INIT')
  }, [store.token])

  function handleToggleNavigation() {
    setState({ ...state, showNav: !showNav })
  }

  return (
    <div className={classNamesContainer(typeof window !== 'object', isLoading, nospace)}>
      <ElemMeta />
      {user && (
        <Photo
          single
          popup
          user={user}
          handleUserProfile={(file, id) => act('USER_UPDATE', { file, id })}
          getMethods={methods => (photoMethods.current = methods)}
          onClose={() => photoMethods.current.handleToggleShow()}
          action={() => props.onChangePhoto(user)}
        />
      )}

      {!empty && <ElemNav
        showNav={!showNav}
        init={init}
        user={user}
        handleChangePicture={() => photoMethods.current.handleToggleShow()}
        handleLogout={() => handle.confirm(() => act('USER_TOKEN_SET'))} />
      }
      <div className={classNameContainer(showNav, nospace)}>
        {info && <ElemInfo onClose={() => handle.clear()} info={info} isResponse={isResponse} statusCode={statusCode} />}
        {isLoading && <ElemPopup isLoading={isLoading} onClose={() => handle.clear()} />}
        {!empty && (
          <ElemHeader
            showNav={showNav}
            light={light}
            title={title}
            onToggleNavigation={() => handleToggleNavigation()}
            breadcrumbs={breadcrumbs}
          />
        )}
        {!error && (
          <div className={classNamesPageWrapper(fullScreen, nospace)}>
            {wrap
              ? <div name="layout" className={classNamesInnerWrapper(empty, nospace, maxWidth)}>
                {children}
              </div>
              : children
            }
          </div>
        )
        }
      </div>

      {confirm && <ElemConfirm action={handle.confirm || console.log} />}
    </div>
  )
}

const classNamesInnerWrapper = (empty, nospace, maxWidth) =>
  fucss({
    'mnh:calc(100vh-95px) mxw:1000px m-rl:auto': true,
    'dp:flx ai:c': empty,
    'mnh:calc(100vh-40px) ': nospace,
    'mxw:100pc': maxWidth
  })

const classNamesContainer = () =>
  fucss({
    'dp:flx md-fs:15px_lh:1.3': true
  })

const classNamesPageWrapper = (fullScreen, nospace) =>
  fucss({
    'p:20px c:white': true,
    'p-t:75px': !fullScreen && !nospace,
    'p-t:20px': nospace
  })

const classNameContainer = (showNav, nospace) => fucss({
  'w:100pc bg:white c:black mnh:100vh p-l:0': true,
  'lg-p-l:250px': showNav,
  'md-p-l:70px': !showNav,
  'md-p-l:0': nospace
})

export { Layout }
export default Layout
