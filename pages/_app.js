import React, { useEffect } from 'react'
import { Container } from 'next/app'
import getConfig from 'next/config'
import useActStore, { ActStore } from 'actstore'
import Router from 'next/router'
import Head from 'next/head'
import config, { getRoutes } from '../src/@clik/configs'
import actions from '../src/@clik/actions'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Cookies from 'js-cookie'

import { ThemeProvider } from 'styled-components'

import '../src/@clik/icons'
import '../static/style.css'

const routes = getRoutes()
const { publicRuntimeConfig } = getConfig()

const theme = {
  prim: '#FCCD12',
  sec: '#FCCD12',
  success: '#00d061',
  danger: '#f57167',
  grey: '#555',
  lightgrey: '#e0e0e0'
}

const App = props => {
  const { Component, pageProps, router = {}, init } = props

  const { store: { token }, act } = useActStore({
    init, config, actions, Cookies,
    router: Router.router || {},
    initialState: { token: Cookies.get('token') },
    handlers: { loading: 'APP_LOADING', info: 'APP_INFO', confirm: 'APP_CONFIRM', clear: 'APP_CLEAR', image: 'APP_IMAGE' }
  }, [])

  useEffect(() => {
    ((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) && Router.push(Router.router.asPath)
    act('APP_INIT')
  }, [])
  return (
    <>
      <Head><title>Clik - Traffic light System</title></Head>
      <main className="prim:FCCD12 sec:FCCD12 tert:1B598D txt:black200 ff:Nunito c:txt bg:fafafa">
        <ThemeProvider theme={theme}>
          <Component {...pageProps} query={Router?.router?.query || {}} init={init} />
        </ThemeProvider>
      </main>
    </>
  )
}

App.getInitialProps = async ({ Component, router, ctx }) => {
  const pageProps = Component.getInitialProps && await Component.getInitialProps(ctx) || {}
  const { asPath } = ctx
  const { version, env } = publicRuntimeConfig || {}

  const { route, query } = router
  return { pageProps, route, query, asPath, init: { version, env, routes }, }
}

export default App
