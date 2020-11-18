import { Layout } from 'clik/comps/layout'
import List from './list'
import Article from './article'
import React from 'react'
import useActStore from 'actstore'

const News = ({ query }) => {
  const { step, page, keywords, status, id  } = query || {}
  const { store: { counts, user, ready } } = useActStore({}, ['counts'])

  return <Layout maxWidth title="News">
    {!!ready && <div className="p:24px p-t:0 bg:white">
      { query.id ? <Article id={query.id}/> : <List { ...query} /> }
    </div>}
  </Layout>
}

export default News
