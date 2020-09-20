import { setDate } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  USER_USER_FETCH: async id => {
    const query = `{ Users(where: { id: { _eq: "${id}"} archived: { _neq: true } }) {
      id role name email photo createdAt phoneNumber
    } }`

    const { Users: [user] } = await act('GQL', { query })

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

    return act('POST', { endpoint: 'userUpdate', body })
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
