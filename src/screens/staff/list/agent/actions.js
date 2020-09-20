import { setDate } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  STAFF_UNSUB: async () => act('UNSUB', { id: 'staff' }),

  STAFF_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 2) => {
    await act('APP_SOCKET_CHECK')
    store.get('staff') && await act('STAFF_UNSUB')

    const search = Boolean(keywords) ? `{ _or: [
      { givenName: {_ilike: "%${keywords}%"}},
      { surname: {_ilike: "%${keywords}%"}},
      { accountNumber: {_ilike: "%${keywords}%"}}
      ${!!parseInt(keywords) ? `{ contacts: {phoneNumber: {_eq: "${keywords}"}} }` : ''}
    ]} ` : ''

    const statusQuery = Boolean(status) ? `{ status: {_eq: ${status}} }` : ''

    const condition = `where: { _and: [
      ${statusQuery}
      { archived: { _neq: true } }
      ${search}
    ]}`

    return act('SUB', {
      id: 'staff',
      query: `subscription {
        Users(limit: ${limit} offset: ${offset} order_by: { createdAt: desc } ${condition}) {
          role name email photo createdAt updatedAt id
        }
      }`,
      action: data => act('STAFF_SET', data, condition)
    })
  },

  STAFF_SET: async (data, condition) => {
    const staffCount = await act('GQL', { query: `{ Users_aggregate(${condition}) { aggregate { count } } }` })
      .then(({ Users_aggregate: { aggregate: { count }}}) => count)

    const staff = data && data.map(item => ({ ...item, createdAt: setDate(item.createdAt) }))

    return store.set({ staff, staffCount, loading: null })
  },

  USER_CREATE: async body => {
    if(!body.role || !body.email || !body.phoneNumber || !body.name)
      return Promise.reject('Please input all fields.')

    return act('POST', { endpoint: 'users', body })
  }
})
