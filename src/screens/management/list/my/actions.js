import { setDate, setName, setAddress } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  ASSIGNED_UNSUB: async () => act('UNSUB', { id: 'assigned' }),

  ASSIGNED_SUB: async ({ offset = 0, limit = 15 }, keywords, status) => {
    await act('APP_SOCKET_CHECK')
    store.get('assigned') && await act('ASSIGNED_UNSUB')

    // handle.loading(true)

    const search = Boolean(keywords) ? `{ _or: [
      { consumer: { givenName: {_ilike: "%${name}%"}} },
      { consumer: { surname: {_ilike: "%${name}%"}} },
      { consumer: { accountNumber: {_ilike: "%${keywords}%"}} }
      ${!!parseInt(keywords) ? `{ consumer: { contacts: {phoneNumber: {_eq: "${keywords}"}} } }` : ''}
    ]} ` : ''

    const statusQuery = status ? `, consumer: { status: {_eq: ${status}} }` : ''

    const condition = `where: {_and: {finishedAt: {_is_null: true}} ${statusQuery}, userId: {_eq: "${store.get('user').id}"} ${search}}`

    return act('SUB', {
      id: 'assigned',
      query: `subscription {
        Assignments(limit:${limit} offset:${offset} order_by:{ createdAt:desc } ${condition}) {
          id userId createdAt updatedAt finishedAt type consumerId merchantId
          user { id name role }
          assigner { id name role }
          consumer {
            id index accountNumber givenName surname createdAt submittedAt updatedAt status
            addresses(order_by: { createdAt: desc } limit: 1) {
              commune district city houseNumber street postalCode country
            }
          }
          merchant { id index accountNumber name companyName status }
        }
      }`,
      action: data => act('ASSIGNMENTS_SET', data, condition)
    })
  },

  ASSIGNMENTS_SET: async (data, condition) => {
    const assignedCount = await act('GQL', { query: `{ Assignments_aggregate(${condition}) { aggregate { count } } }` })
      .then(({ Assignments_aggregate: { aggregate: { count }}}) => count)

    const assigned = data && data.map(item => ({
      ...item,
      name: setName(item.consumer),
      address: setAddress(item?.consumer?.addresses && item?.consumer?.addresses[0] || {}),
      createdAt: setDate(item.consumer?.createdAt),
      assignedAt: setDate(item.createdAt),
      submittedAt: setDate(item.consumer?.submittedAt),
      status: store.get('enums').statuses.find(status => status.value === item?.consumer?.status).text
    }))

    return store.set({ assigned, assignedCount, loading: null })
  }
})
