import firebase from 'clik/hooks/firebase'

export const actions = ({ act, store, handle }) => ({
  MERCHANTS_UNSUB: () => {
    console.log("MERCHANTS_UNSUB")
    Promise.all([act('UNSUB', { id: 'merchants' }), act('UNSUB', { id: 'merchants_count' }), act('UNSUB', { id: 'merchant' })])
  },

  DASHBOARD_FETCH: async () => {
    handle.loading(true)
    console.log("DASHBOARD_FETCH")
    return act('GQL', {
      query: `{
        dashboards{
          id index banner
        }
        informations{
          id phoneNumbers facebook announcement guidelineUrl promotionUrl
        }
      }`
    }).then(data => act('DASHBOARD_SET', data))
  },

  DASHBOARD_SET: (results) => {
    handle.loading(false)

    // if(!!results)
    //   results['categories'] = results['categories'] && results['categories'].reduce((obj, result) => {
    //     if (obj && obj[result.name] && !!obj[result.name].length )
    //       obj[result.name] = obj[result.name].concat([result])
    //     else
    //       obj[result.name] = [result]
    //     return obj
    //   }, {}) || {}
    return store.set({ ...results, loading: null })
  },

  DASHBOARD_DELETE: data => {
    const query = `mutation{
      delete_dashboards(where: { id: { _eq: "${data.id}"}}){ affected_rows }
    }`

    return act("GQL", { query }).then(({delete_dashboards: { affected_rows }}) => {
      if(affected_rows > 0)
        return act('DASHBOARD_FETCH')

      return
    })
  },

  DASHBOARD_CREATE: ({file, type}) => {
    const storageRef = `images/${type}/`
    const fileName = new Date().getTime().toString()
    var storage = firebase.storage().ref(storageRef);
  
    var mountainImagesRef = storage.child(fileName);
    return mountainImagesRef.put(file[0]).on('state_changed',sp => {}, (err) => {}, () => {
      storage.child(fileName).getDownloadURL()
        .then(async (url) => {
          const query = `
            mutation{ insert_dashboards(objects: { banner: "${url}"}){ affected_rows } }
          `

          return act("GQL", { query }).then(({insert_dashboards: { affected_rows }}) => {
            if(affected_rows > 0)
              return act('DASHBOARD_FETCH')
      
            return
          })
        })
    })
  },

  INFORMATION_FETCH: async () => {
    console.log("INFORMATION_FETCH")
    return act('GQL', {
      query: `{ informations{ id phoneNumbers facebook announcement guidelineUrl promotionUrl  }
      }`
    }).then(({informations }) => act('INFORMATION_SET', informations)).catch(console.log)
  },

  INFORMATION_UPDATE: async (data) => {
    handle.loading(true)
    return act('GQL', {
      query: `mutation($data: informations_set_input){
        update_informations(where: { id: { _eq: "${data.id}"}} _set: $data){
          returning{
            id phoneNumbers facebook announcement guidelineUrl promotionUrl
          }
        }
      }`,
      variables: { data }
    }).then(({update_informations: { returning }}) => act('INFORMATION_SET', returning))
  },

  INFORMATION_SET: (informations = []) => {
    console.log("informations", informations)
    handle.loading(false)
    return store.set({ informations, loading: null })
  },

  CATEGORIES_FETCH: async () => {
    handle.loading(true)
    console.log("CATEGORIES_FETCH")
    return act('GQL', {
      query: `{
        categories: Categories(order_by: { name: asc_nulls_last }){
          id banner name
        }
      }`
    }).then(data => act('CATEGORIES_SET', data || {})).catch(console.log)
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

  CATEGORIES_DELETE: (data) => {
    const query = `mutation{
      delete_Categories(where: { id: { _eq: "${data.id}"}}){ affected_rows }
    }`
    console.log({data})
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
