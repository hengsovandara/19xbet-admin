export const actions = ({ act, store, handle }) => ({
  MERCHANTS_UNSUB: () => {
    Promise.all([act('UNSUB', { id: 'merchants' }), act('UNSUB', { id: 'merchants_count' }), act('UNSUB', { id: 'merchant' })])
  },

  MERCHANTS_SUB: async () => {
    handle.loading(true)
    return act('GQL', {
      query: `{
        dashboards: Dashboards{
          id index banner
        }
        categories: Categories(order_by: { name: asc_nulls_last }){
          id banner name
        }
        informations: Informations{
          id twitter email facebook phoneNumbers youtube
        }
      }`
    }).then(data => act('MERCHANTS_SET', data))
  },

  MERCHANTS_SET: (results) => {
    handle.loading(false)

    if(!!results)
      results['categories'] = results['categories'] && results['categories'].reduce((obj, result) => {
        if (obj && obj[result.name] && !!obj[result.name].length )
          obj[result.name] << result
        else
          obj[result.name] = [result]
        return obj
      }, {}) || {}
    return store.set({ ...results, loading: null })
  },

  DASHBOARD_DELETE: data => {
    alert(JSON.stringify(data, 0, 2))
    const query = `mutation{
      delete_Dashboards(where: { id: { _eq: "${data.id}"}}){ affected_rows }
    }`

    return act("GQL", { query }).then(({delete_Dashboards: { affected_rows }}) => {
      if(affected_rows > 0)
        return act('MERCHANTS_SUB')

      return
    })
  }
})
