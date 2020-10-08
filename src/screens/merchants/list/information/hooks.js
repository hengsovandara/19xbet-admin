export const actions = ({ act, store, handle }) => ({

  INFORMATION_FETCH: async () => {
    console.log("INFORMATION_FETCH")
    return act('GQL', {
      query: `{ Informations{ id twitter email facebook phoneNumbers youtube  }
      }`
    }).then(({Informations }) => act('INFORMATION_SET', Informations))
  },

  INFORMATION_UPDATE: async (data) => {
    handle.loading(true)
    return act('GQL', {
      query: `mutation($data: Informations_set_input){
        update_Informations(where: { id: { _eq: ${data.id}}} _set: $data){
          returning{
            id twitter email facebook phoneNumbers youtube 
          }
        }
      }`,
      variables: { data }
    }).then(({update_Informations: { returning }}) => act('INFORMATION_SET', returning))
  },

  INFORMATION_SET: (informations = []) => {
    handle.loading(false)
    return store.set({ informations, loading: null })
  }
})
