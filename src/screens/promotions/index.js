import { Layout } from 'clik/comps/layout'
import List from './list'
import Article from './article'
import React from 'react'
import useActStore from 'actstore'

const News = ({ query }) => {
  const { store: { ready } } = useActStore({}, ['counts'])
  return <Layout maxWidth title="Promotions">
    {!!ready && <div className="p:24px p-t:0 bg:white">
      { (query.id || query.create) ? <Article { ...query }/> : <List { ...query} /> }
    </div>}
  </Layout>
}

export default News
