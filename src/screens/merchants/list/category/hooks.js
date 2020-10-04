import firebase from 'clik/hooks/firebase'

export const actions = ({ act, store, action, handle }) => ({
  MERCHANTS_UNSUB: () => {
    Promise.all([act('UNSUB', { id: 'merchants' }), act('UNSUB', { id: 'merchants_count' }), act('UNSUB', { id: 'merchant' })])
  },

  CATEGORIES_FETCH: async () => {
    handle.loading(true)

    return act('GQL', {
      query: `{
        categories: Categories(order_by: { name: asc_nulls_last }){
          id banner name
        }
      }`
    }).then(data => act('CATEGORIES_SET', data || {}))
  },

  CATEGORIES_SET: ({categories = []}) => {
    handle.loading(false)

    categories = categories && categories.reduce((obj, result) => {
      if (obj[result.name] && !!obj[result.name].length )
        obj[result.name] = obj[result.name].concat([result])
      else
        obj[result.name] = [result]

      return obj
    }, {}) || {}

    return store.set({ categories, loading: null })
  },

  CATEGORIES_DELETE: data => {
    const query = `mutation{
      delete_Categories(where: { id: { _eq: "${data.id}"}}){ affected_rows }
    }`

    return act("GQL", { query }).then(({delete_Categories: { affected_rows }}) => {
      if(affected_rows > 0)
        return act('CATEGORIES_FETCH')
      return
    })
  },

  CATEGORIES_CREATE: ({file, type}) => {
    const storageRef = `images/${type}/`
    const fileName = new Date().getTime().toString()
    var storage = firebase.storage().ref(storageRef);

    var mountainImagesRef = storage.child(fileName);
    return mountainImagesRef.put(file[0]).on('state_changed',sp => {}, (err) => {}, () => {
      storage.child(fileName).getDownloadURL()
        .then(async (url) => {
          const query = `
            mutation{ insert_Categories(objects: { name: "${type}" banner: "${url}"}){ affected_rows } }
          `

          return act("GQL", { query }).then(({insert_Categories: { affected_rows }}) => {
            if(affected_rows > 0)
              return act('CATEGORIES_FETCH')
      
            return
          })
        })
    })
  }
})
