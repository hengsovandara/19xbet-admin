import { setDate } from 'clik/libs'

function setAddress({ city, district, commune }) {
  return (city && [city, district, commune].filter(v => v && v.length).join(', ')) || 'N/A'
}

function setName({ givenName, surname, index }) {
  const name = [surname, givenName].filter(item => Boolean(item))
  return name.length ? name.join(' ') : index
}

export default ({ act, store, action, handle, cookies, route }) => ({
  TEAMED_UNSUB: async () => act('UNSUB', { id: 'teamed' }),

  TEAMED_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 2) => {
    await act('APP_SOCKET_CHECK')
    store.get('teamed') && await act('TEAMED_UNSUB')

    // handle.loading(true)

    const search = Boolean(keywords) ? `{ _or: [
      { consumer: { givenName: {_ilike: "%${name}%"}} },
      { consumer: { surname: {_ilike: "%${name}%"}} },
      { consumer: { accountNumber: {_ilike: "%${keywords}%"}} }
      ${!!parseInt(keywords) ? `{ consumer: { contacts: {phoneNumber: {_eq: "${keywords}"}} } }` : ''}
    ]} ` : ''

    const condition = `where: {_and: {finishedAt: {_is_null: true}}, userId: {_is_null: true}, role: {_eq: "${store.get('user').role}"} ${search}}`

    return act('SUB', {
      id: 'teamed',
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
      action: data => act('TEAMED_SET', data, condition)
    })
  },

  TEAMED_SET: async (data, condition) => {
    const teamedCount = await act('GQL', { query: `{ Assignments_aggregate(${condition}) { aggregate { count } } }` })
      .then(({ Assignments_aggregate: { aggregate: { count }}}) => count)

    const teamed = data && data.map(item => ({
      ...item,
      name: setName(item.consumer),
      address: setAddress(item?.consumer?.addresses && item?.consumer?.addresses[0] || {}),
      createdAt: setDate(item.consumer?.createdAt),
      assignedAt: setDate(item.createdAt),
      submittedAt: setDate(item.consumer?.submittedAt),
      status: store.get('enums').statuses.find(status => status.value === item?.consumer?.status).text
    }))

    return store.set({ teamed, teamedCount, loading: null })
  },

  TEAMED_ASSIGN_SELF: async ({ id }) => {
    handle.loading(true)
    const userId = store.get('user').id

    await act('GQL', { query: `mutation {
      update_Assignments(where: {id: {_eq: "${id}"}}, _set: {
        userId: "${userId}",
        type: "consumer",
        assignerId: "${userId}"
      }) { affected_rows }
    }`}).catch(error => handle.info(error))

    return null
  }
})
