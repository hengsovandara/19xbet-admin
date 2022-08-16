import { setDate } from 'clik/libs'
import firebase from 'clik/hooks/firebase'

const actions = ({ act, store, action, handle, cookies, route }) => ({
  PROMOTIONS_FETCH: async ({}, keywords) => {

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
        promotions(order_by: { createdAt: desc } ${condition}) {
          id title content imageUrl createdAt
        }
      }`
    }).then(({promotions}) => promotions)
    return store.set({ promotions: data, loading: null })
  },

  PROMOTION_FETCH: async({id}) => {
    if(!id)
      return store.set({ promotion: {}, ready: true })

    const data = await act('GQL', {
      query: `query {
        promotions_by_pk(id: "${id}"){ id title content imageUrl createdAt }
      }`
    }).then(({promotions_by_pk}) => promotions_by_pk)

    return store.set({ promotion: data, ready: true })
  },

  PROMOTION_UPSERT: async (data, file, onDone = () => {}) => {
    handle.loading(true)
    try {
      const { user = {} } = store.get()
      if(!user.id)
        return

      if(!!file){
        const imageUrl = await act("UPLOAD", {file, type: "news", data, onDone})
        return
      }
      
      data = await act('GQL', {
        query: `mutation($values: [promotions_insert_input!]!){
          insert_promotions(
            objects: $values
            on_conflict: { constraint: promotions_pkey update_columns: [content imageUrl title staffId]}
          ){ returning { id title content imageUrl createdAt } }
        }`,
        variables: { values: {...data, staffId: user.id} }
      }).then(({insert_promotions: { returning }}) => returning)
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
          return act('PROMOTION_UPSERT', data, null, onDone)
        })
    })
  },

  PROMOTION_DELETE: async (data) => {
    handle.loading(true)
    try {
      const { ids = [], onDone = () => {} } = data
    
      data = await act('GQL', {
        query: `mutation{
          delete_promotions( where: { id: { _in: ${JSON.stringify(ids)}}}
          ){ affected_rows }
        }`
      }).then(({delete_promotions: { affected_rows }}) => affected_rows)

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
