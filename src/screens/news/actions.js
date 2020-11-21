import { setDate } from 'clik/libs'
import firebase from 'clik/hooks/firebase'

const actions = ({ act, store, action, handle, cookies, route }) => ({
  NEWS_FETCH: async ({ offset = 0, limit = 15 }, keywords) => {

    const search = Boolean(keywords) ? `{ _or: [
      ${keywords.split(' ').map(word => `
        { name: {_ilike: "%${word}%"}},
        { walletId: {_ilike: "%${word}%"}},
        { phoneNumber: {_ilike: "%${word}%"}}
      `).join('')}
    ]} ` : ''

    const condition = `where: { _and: [ ${search} ]}`

    const data = await act('GQL', {
      query: `query {
        News(limit: ${limit} offset: ${offset} order_by: { createdAt: desc } ${condition}) {
          id title content imageUrl createdAt staff { id name photo }
        }
      }`
    }).then(({News}) => News)
    return act('NEWS_SET', data, condition)
  },

  NEWS_SET: async (data, condition) => {
    const newsCount = await act('GQL', { query: `{ News_aggregate(${condition}) { aggregate { count } } }` })
    .then(({ News_aggregate: { aggregate: { count }}}) => count)

    const news = data && data.map(item => ({
      ...item,
      createdAt: setDate(item.createdAt)
    }))
    return store.set({ news, newsCount, loading: null })
  },

  ARTICLE_FETCH: async({id}) => {
    const data = await act('GQL', {
      query: `query {
        News_by_pk(id: "${id}"){ id title content imageUrl createdAt }
      }`
    }).then(({News_by_pk}) => News_by_pk)

    return store.set({ article: data, ready: true })
  },

  ARTICLE_UPSERT: async (data, file, onDone = () => {}) => {
    handle.loading(true)
    try {
      if(!!file){
        const imageUrl = await act("UPLOAD", {file, type: "news", data, onDone})
        return
      }
  
      data = await act('GQL', {
        query: `mutation($values: [News_insert_input!]!){
          insert_News(
            objects: $values
            on_conflict: { constraint: News_pkey update_columns: [content imageUrl title]}
          ){ returning { id title content imageUrl createdAt } }
        }`,
        variables: { values: data }
      }).then(({insert_News: { returning }}) => returning)
      handle.loading()
      onDone()
      return
    } catch (error) {
      handle.loading()
      console.log(error)
    }
  },

  UPLOAD: async ({file, type, data, onDone}) => {
    const storageRef = `images/${type}/`
    const fileName = new Date().getTime().toString()
    var storage = firebase.storage().ref(storageRef);

    var mountainImagesRef = storage.child(fileName);
    return await mountainImagesRef.put(file).on('state_changed',sp => {}, (err) => {}, async () => {
      return await storage.child(fileName).getDownloadURL()
        .then(url => {
          data['imageUrl'] = url
          return act('ARTICLE_UPSERT', data, null, onDone)
        })
    })
  },

  ARTICLE_DELETE: async (data) => {
    handle.loading(true)
    try {
      const { ids = [], onDone = () => {} } = data
    
      data = await act('GQL', {
        query: `mutation{
          delete_News( where: { id: { _in: ${JSON.stringify(ids)}}}
          ){ affected_rows }
        }`
      }).then(({delete_News: { affected_rows }}) => affected_rows)

      handle.loading(false)
      onDone()
      return 
    } catch (error) {
      handle.loading(false)
      console.log(error)
    }
  }
})

export default actions;
