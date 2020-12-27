import { setDate } from 'clik/libs'

const actions = ({ act, store, action, handle, cookies, route }) => ({
  USER_USER_FETCH: async id => {
    const query = `{ Staffs(where: { id: { _eq: "${id}"} }) {
      id role name email photo createdAt phoneNumber
    } }`

    const { Staffs: [user] } = await act('GQL', { query })

    return !!Object.keys(user || {}).length && { ...user, createdAt: setDate(user.createdAt)} || {}
  },

  USER_ASSIGNMENTS_FETCH: async userId => {
    const query = `{ Assignments(where: { userId: { _eq: "${userId}"} user: { archived: { _neq: true} } type: { _eq: "consumer" } }) {
      id createdAt finishedAt finished
      user { name }
      consumer { id givenName surname }
    } }`

    return await act('GQL', { query }).then(({ Assignments }) => (Assignments))
  },

  USER_UPDATE: async ( body = {} ) => {
    if(!body.phoneNumber || !body.email || !body.role || !body.id || !body.name)
      return Promise.reject('Please input all fields.')

    delete body["createdAt"]
    const query = `
      mutation($values: [Staffs_insert_input!]!){
        insert_Staffs(objects: $values on_conflict: {
          constraint: Staff_pkey
          update_columns: [name email photo role]
        }){
          returning{ role name email photo createdAt id phoneNumber }
        }
      }
    `

    return act('GQL', { query, variables: { values: body } })
  },

  USER_CHANGE_PIN: async ( body = {} ) => {
    if(!body.newPin || !body.oldPin)
      return Promise.reject('Please input all fields.')

    return act('POST', { endpoint: 'userReset', body })
  },

  USER_DELETE: async userId => {
    if(!userId)
      return Promise.reject('Missing User ID.')

    return act('DELETE', { endpoint: 'users', body: { id: userId } }).then(() => route.set('/staff'))
  },

  USER_RESET_PIN: async userId => {
    if(!userId)
      return Promise.reject('Missing User ID.')

    return act('POST', { endpoint: 'userReset', body: { id: userId } }).then(() => route.set('/staff'))
  }
})

export default actions
