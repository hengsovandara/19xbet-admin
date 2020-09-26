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

    // const condition = `where: {_and: {finishedAt: {_is_null: true}} ${statusQuery}, userId: {_eq: "${store.get('user').id}"} ${search}}`
    const condition = ``

    return act('SUB', {
      id: 'assigned',
      query: `subscription {
        Transactions(limit:${limit} offset:${offset} order_by:{ createdAt:desc } ${condition}) {
          id type method imageUrl amount createdAt userId index status acceptedAt
          user{ id name email phoneNumber }
          staff { id name }
        }
      }`,
      action: data => act('ASSIGNMENTS_SET', data, condition)
    })
  },

  ASSIGNMENTS_SET: async (data, condition) => {
    const assignedCount = await act('GQL', { query: `{ Transactions_aggregate{ aggregate { count } } }` })
      .then(({ Transactions_aggregate: { aggregate: { count }}}) => count)
    const assigned = data && data.map(item => ({
      ...item,
      createdAt: setDate(item?.createdAt),
      assignedAt: new Date().toLocaleString(),
      submittedAt: new Date().toLocaleString(),
      status: "finish"
    }))
    return store.set({ assigned, assignedCount, loading: null })
  }
})
