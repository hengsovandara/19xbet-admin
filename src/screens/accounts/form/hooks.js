export const actions = ({ act, store, action, handle }) => ({
  SUB_AN_ACCOUNT: ({ id }) => {
    act('SUB', {
      id: 'account',
      query: `subscription {
        Users(where: { id: {_eq: "${id}" } }) {
          id
          name
          photo
          role
          email
          credential {
            phoneNumber
            corporationId
            corporation {
              id
              name
              logo
            }
          }
        }
      }`,
      action: ([data]) => {
        data['credentials'] = data['credential']
        delete data['credential']
        store.set({ account: data })
      }
    })
  },
  UNSUB_AN_ACCOUNT: () => { act('UNSUB', { id: 'account' }); store.set({ account: null }); },
  UPSERT_ACCOUNT: obj => {
    return new Promise(async (res, rej) => {
      if(!obj) return res('Nth to insert')

      try {
        obj['credentials'] && delete obj['credentials']['corporation']
        const credentialColumns = obj.id ? ['phoneNumber', 'corporationId'] : ['phoneNumber', 'corporationId', 'pin']
        obj = {
          ...obj,
          credentials: {
            on_conflict: { constraint: 'Credentials_phoneNumber_key', update_columns: credentialColumns },
            data: { ...obj['credentials'], pin: obj.id ? undefined : '12345' }
          }
        }
        const columns = Object.keys(obj).filter(item => !['credentials', 'id'].includes(item)).join(' ')
        const query = `mutation ($obj: [Users_insert_input!]!) {
          insert_Users(objects: $obj, on_conflict: {constraint: Users_pkey, update_columns: [${columns}]}) {
            returning {
              id
            }
          }
        }`
        const upsert = await act('GQL', { query, variables: { obj } })
        res(upsert)
      } catch (e) { rej(e) }
    })
  }
})
