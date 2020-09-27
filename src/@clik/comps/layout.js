import React, { useState, useRef, Fragment } from 'react'
import { fucss } from 'next-fucss/utils'
import ElemMeta from './meta'
import ElemNav from './nav'
import ElemHeader from './header'
import { ElemPopup, ElemInfo, ElemConfirm } from './fillers'
import Photo from '../elems/photo'
import useActStore from 'actstore'
import Select from '../elems/select'

const Layout = props => {
  const { breadcrumbs, children, empty, fullScreen, light = true, nospace, maxWidth, title = null, wrap = true, onBack, titleAlt, filter, background, backgroundColor } = props
  const [state, setState] = useState({
    showNav: !empty && true,
    showNotifications: false
  })
  const { showNav, showNotifications } = state

  const { store } = useActStore({ actions: () => ({}) }, ['user']) || {}
  const { user } = store

  function handleToggleNavigation() {
    setState({ ...state, showNav: !showNav })
  }

  return (
    <div className={classNamesContainer()}>
      <ElemMeta />
      <Navigation {...props} showNav={showNav} showNotifications={showNotifications} handleToggleNavigation={handleToggleNavigation} />
      <div className={classNameContainer(showNav, nospace)}>
        {!empty && (
          <ElemHeader
            {...props}
            user={user}
            onBack={onBack}
            showNav={showNav}
            light={light}
            title={title}
            breadcrumbs={breadcrumbs}
          />
        )}
        <div className={classNamesPageWrapper(fullScreen, nospace, backgroundColor)} style={background && {backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
          {wrap
            ? <div name="layout" className={classNamesInnerWrapper(empty, nospace, maxWidth)}>
              {!!title && 
                <div className={classNamesTitle(titleAlt)}>
                  <h2>{title}</h2>
                  {filter && <div className="w:100pc mxw:160px">
                    <Select transparent value="All Time" options={['All Time','1 Month', '3 Months', '6 Months', '12 Months']} onClick={null} />
                  </div>}
                </div>
              }
              {children}
              </div>
            : <>
              {!!title && <h2 className={classNamesTitle(titleAlt)}>{title}</h2>}
              {children}
            </>
          }
        </div>
      </div>
      <Inner />
    </div>
  )
}

export { Layout }
export default Layout

const Inner = props => {
  const { handle, store } = useActStore({ actions: () => ({}) }, ['info', 'loading', 'confirm', 'error', 'token']) || {}
  const { info, loading, confirm } = store

  return <Fragment>
    {info && <ElemInfo onClose={() => handle.clear()} info={info} />}
    {confirm && <ElemConfirm action={handle.confirm || console.log} />}
    {loading && <ElemPopup isLoading={loading} onClose={() => handle.clear()} />}
  </Fragment>
}

const Navigation = (props) => {
  const { status, handle, store, act, init } = useActStore({ actions: () => ({}) }, ['user']) || {}
  const { user } = store
  let photoMethods = useRef(null)

  return <Fragment>
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

    {!props.empty && <ElemNav
      showNav={!props.showNav}
      init={init}
      user={user}
      onToggleNavigation={() => props.handleToggleNavigation()}
      handleChangePicture={() => photoMethods.current.handleToggleShow()}
      handleLogout={() => handle.confirm(() => act('USER_TOKEN_SET'))}
    />}
  </Fragment>
}

const classNamesInnerWrapper = (empty, nospace, maxWidth) => fucss({
  'h:100pc m-rl:auto': true,
  'dp:flx ai:c': empty,
  'mnh:calc(100vh-70px) ': nospace,
  'mxw:100pc': maxWidth
})

const classNamesContainer = () => fucss({
  'dp:flx md-fs:14px_lh:1.3': true
})

const classNamesTitle = (titleAlt) => fucss({
  'ta:l p:24px dp:flx ai:c jc:sb': true,
  'bg:white': !titleAlt,
  'bg:blacka06': titleAlt
})

const classNamesPageWrapper = (fullScreen, nospace, backgroundColor) => fucss({
  'p-t:70px h:100pc': !fullScreen && !nospace,
  'h:100pc': nospace,
  'bg:blacka08': backgroundColor
})

const classNameContainer = (showNav, nospace) => fucss({
  'w:100pc bg:fff c:black mnh:100vh p-l:0': true,
  'lg-p-l:280px': showNav,
  'md-p-l:70px': !showNav,
  'p-l:0 md-p-l:0': nospace
})
