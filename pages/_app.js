import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import getConfig from 'next/config'
//import { GlobalProvider } from 'actstore';
//import useActStore from 'actstore';
import { ActStore } from 'actstore'
import Router from 'next/router'
import config, { getRoutes } from '../src/@clik/configs'
import actions from '../src/@clik/actions'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { ThemeProvider } from 'styled-components'

import '../src/@clik/icons'
import '../static/style.css'

const routes = getRoutes()
const { publicRuntimeConfig } = getConfig()

/*const ActStore = (props) => {
  const actStore = useActStore(props);
  const { act, cookies, store } = actStore;
  console.log("actStore init", actStore);
  return null
};*/

const theme = {
  prim: '#FCCD12',
  sec: '#FCCD12',
  success: '#00d061',
  danger: '#f57167',
  grey: '#555',
  lightgrey: '#e0e0e0'
}

export default class extends App {

  render() {
    const { Component, pageProps, router = {}, init } = this.props

    const query = Router.router && Router.router.query && Object.keys(Router.router.query).length
      ? Router.router.query
      : this.state.query
    // console.log("app", router.query, this.state.query, query)
    return (
      <>
        <ActStore init={init} initialState={{ test: "test" }} config={config} router={Router.router || {}} actions={actions} />
        {/*<GlobalProvider init={init} config={config} router={router} actions={actions}>*/}
        <main className="prim:teal300 sec:134168 tert:1B598D txt:black200 ff:Nunito c:txt bg:black">
          <ThemeProvider theme={theme}>
            <Component {...pageProps} query={Router.router && Router.router.query || {}} init={init} />
          </ThemeProvider>
        </main>
        {/*</GlobalProvider>*/}
      </>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      query: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("receive", this.props, nextProps)
    if (Object.keys(this.state.query).length && (nextProps.query !== this.props.query))
      this.setState({ query: {} })
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search.split(/\?/)[1])
    const query = {}
    for (const [key, value] of searchParams) {
      query[key] = value
    }
    this.setState({ query })
  }

  static async getInitialProps({ Component, router, ctx }) {
    const pageProps = Component.getInitialProps && await Component.getInitialProps(ctx) || {}
    const { asPath } = ctx
    const { version, env } = publicRuntimeConfig || {}

    const { route, query } = router
    return { pageProps, route, query, asPath, init: { version, env, routes }, }
  }
}
