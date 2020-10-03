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
        categories: Categories {
          id banner name
        }
        informations: Informations{
          id twitter email facebook phoneNumbers youtube
        }
      }`
    }).then(data => act('MERCHANTS_SET', data))
  },

  MERCHANTS_SET: res => {
    handle.loading(false)
    return store.set({ ...res, loading: null })
  }
})
