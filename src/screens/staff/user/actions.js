import { setDate } from 'clik/libs'

const actions = ({ act, store, action, handle, cookies, route }) => ({
  USER_USER_FETCH: async id => {
    const query = `{ staffs(where: { id: { _eq: "${id}"} }) {
      id role name email photo createdAt phoneNumber
    } }`

    const { staffs: [user] } = await act('GQL', { query })

    return !!Object.keys(user || {}).length && { ...user, createdAt: setDate(user.createdAt)} || {}
  },

  USER_UPDATE: async ( body = {} ) => {
    if(!body.phoneNumber || !body.email || !body.role || !body.id || !body.name)
      return Promise.reject('Please input all fields.')

    delete body["createdAt"]
    if(!!body.pin)
      act("USER_CHANGE_PIN", body)

    delete body["pin"]
    const query = `
      mutation($values: [staffs_insert_input!]!){
        insert_staffs(objects: $values on_conflict: {
          constraint: staffs_pkey
          update_columns: [name email photo role]
        }){
          returning{ role name email photo createdAt id phoneNumber }
        }
      }
    `

    return act('GQL', { query, variables: { values: body } })
  },

  USER_CHANGE_PIN: async ( body = {} ) => {
    const query = `
      mutation{
        update_credentials(where:{ staffId: { _eq: "${body.id}"}} _set: { password: "${body.pin}"}){
          affected_rows
        }
      }
    `

    return act('GQL', { query })
  },

  USER_DELETE: async userId => {
    if(!userId)
      return Promise.reject('Missing User ID.')

    const query = `
      mutation{ delete_staffs(where: { id: { _eq: "${userId}"}}){ affected_rows } }
    `

    return act('GQL', { query }).then(() => route.set('/staff'))
  },

  USER_RESET_PIN: async userId => {
    if(!userId)
      return Promise.reject('Missing User ID.')

    return act('POST', { endpoint: 'userReset', body: { id: userId } }).then(() => route.set('/staff'))
  }
})

export default actions
