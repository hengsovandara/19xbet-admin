import { Layout } from 'clik/comps/layout'
import List from './list'
import React from 'react'
import useActStore from 'actstore'

const News = ({ query }) => {
  const { step, page, keywords, status } = query || {}
  const { store: { counts, user, ready } } = useActStore({}, ['counts'])

  return <Layout maxWidth title="News">
    {!!ready && <div className="p:24px p-t:0 bg:white">
      <List { ...query} />
    </div>}
  </Layout>
}

export default News
