export const actions = ({ act, store, action, handle }) => ({
  FETCH_CORPOPRATIONS: async () => {
    const { enum_corporations = [] } = await act('GQL', { query: `{ enum_corporations { id logo name } }` })
    store.set({ corporations: enum_corporations })
  },
  SUB_ACCOUNTS: ({ limit, offset }) => {
    act('SUB', {
      id: 'accounts',
      query: `subscription {
        Users(order_by: {name: asc_nulls_last}, limit: ${limit}, offset: ${offset}) {
          id
          name
          photo
          role
          email
          credential {
            phoneNumber
            corporation {
              id
              name
              logo
            }
          }
        }
      }`,
      action: action('STORE_ACCOUNTS_DATA')
    })
  },
  STORE_ACCOUNTS_DATA: async data => {
    const { Users_aggregate: { aggregate: { count } } } = await act('GQL', { query: '{ Users_aggregate{ aggregate { count }} }' })
    store.set({ accounts: data, count })
  }
})
