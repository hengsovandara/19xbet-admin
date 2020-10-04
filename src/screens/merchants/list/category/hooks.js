export const actions = ({ act, store, action, handle }) => ({
  MERCHANTS_UNSUB: () => {
    Promise.all([act('UNSUB', { id: 'merchants' }), act('UNSUB', { id: 'merchants_count' }), act('UNSUB', { id: 'merchant' })])
  },

  CATEGORIES_SUB: async () => {
    handle.loading(true)
    return act('GQL', {
      query: `{
        categories: Categories(order_by: { name: asc_nulls_last }){
          id banner name
        }
      }`
    }).then(data => act('CATEGORIES_SET', data))
  },

  CATEGORIES_SET: ({categories = []}) => {
    handle.loading(false)
    categories = categories && categories.reduce((obj, result) => {
      if (obj[result.name] && !!obj[result.name].length )
        obj[result.name] << result
      else
        obj[result.name] = [result]

      return obj
    }, {}) || {}
    return store.set({ ...categories, loading: null })
  },

  CATEGORIES_DELETE: data => {
    alert(JSON.stringify(data, 0, 2))
    const query = `mutation{
      delete_Dashboards(where: { id: { _eq: "${data.id}"}}){ affected_rows }
    }`

    return act("GQL", { query }).then(({delete_Dashboards: { affected_rows }}) => {
      if(affected_rows > 0)
        return act('CATEGORIES_SUB')

      return
    })
  }
})
