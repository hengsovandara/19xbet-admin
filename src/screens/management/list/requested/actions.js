import { setDate } from 'clik/libs'

function setAddress({ city, district, commune }) {
  return (city && [city, district, commune].filter(v => v && v.length).join(', ')) || 'N/A'
}

function setName({ givenName, surname, index }) {
  const name = [surname, givenName].filter(item => Boolean(item))
  return name.length ? name.join(' ') : index
}

export default ({ act, store, action, handle, cookies, route }) => ({
  MANAGEMENT_LIST_REQUESTED_UNSUB: async () => act('UNSUB', { id: 'managementConsumers' }),

  MANAGEMENT_LIST_REQUESTED_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 3) => {
    await act('APP_SOCKET_CHECK')
    store.get('managementConsumers') && await act('MANAGEMENT_LIST_REQUESTED_UNSUB')

    // handle.loading(true)

    const search = Boolean(keywords) ? `{ _or: [
      { givenName: {_ilike: "%${keywords}%"}},
      { surname: {_ilike: "%${keywords}%"}},
      { accountNumber: {_ilike: "%${keywords}%"}}
      ${!!parseInt(keywords) ? `{ contacts: {phoneNumber: {_eq: "${keywords}"}} }` : ''}
    ]} ` : ''

    const condition = `where: { _and: [
      { status: {_eq: ${status}} }
      {_or: [
        { _not: {assignments: {}}},
        { _not: {assignments: { finishedAt: { _is_null: true}}}}
      ]}
      ${search}
    ]}`

    return act('SUB', {
      id: 'managementConsumers',
      query: `subscription {
        Consumers(limit: ${limit} offset: ${offset} order_by: { submittedAt: desc } ${condition}) {
          index id accountNumber status
          givenName surname
          createdAt updatedAt submittedAt
          addresses(order_by: { createdAt: desc } limit: 1) {
            commune district city houseNumber street postalCode country
          }
        }
      }`,
      action: data => act('MANAGEMENT_LIST_REQUESTED_SET', data, condition)
    })
  },

  MANAGEMENT_LIST_REQUESTED_SET: async (data, condition) => {
    // !store.get('loading') && handle.loading(true)
    const managementConsumersCount = await act('GQL', { query: `{ Consumers_aggregate(${condition}) { aggregate { count } } }` })
      .then(({ Consumers_aggregate: { aggregate: { count }}}) => count)

    const managementConsumers = data && data.map(item => ({
      ...item,
      name: setName(item),
      address: setAddress(item?.addresses && item?.addresses[0] || {}),
      createdAt: setDate(item.createdAt),
      submittedAt: setDate(item.submittedAt),
      status: store.get('enums').statuses.find(status => status.value === item.status).text
    }))

    return store.set({ managementConsumers, managementConsumersCount, loading: null })
  },

  MANAGEMENT_LIST_REQUESTED_ASSIGN: async (consumerIds, user) => {
    handle.loading(true)
    const result = await act('GQL', {
      query: `mutation($objects: [Assignments_insert_input!]! ) { insert_Assignments(objects: $objects) { returning { id } } }`,
      variables: { objects: consumerIds.map(id => ({ consumerId: id, userId: user.value, type: 'consumer', assignerId: store.get('user').id })) }
    }).catch(error => console.log(error))
  },

  MANAGEMENT_LIST_REQUESTED_ASSIGN_SELF: async ({ id }) => {
    handle.loading(true)
    const userId = store.get('user').id
    const query = `{ Assignments(where: {_or: [
      { consumerId: {_eq: "${id}"}, finishedAt: {_is_null: true} }
      { userId: {_eq: "${userId}"}, finishedAt: {_is_null: true} }
    ] }) { id finishedAt } }`
    const assignments = await act('GQL', { query }).then(({ Assignments }) => Assignments)

    if(!!assignments.length) {
      return handle.info(`You already have ${assignments.length} tasks or this case is already assigned`)
      throw 'already have assignment'
    }

    return await act('GQL', { query: `mutation {
      insert_Assignments(objects: { finished: "", userId: "${userId}", consumerId: "${id}", type: "consumer", assignerId: "${userId}" }){ returning { id } }
    }` })
    .then(() => null)
    .catch(error => {
      console.log(error)
      return handle.info(`You already have ${assignments.length} tasks or this case is already assigned`)
    })
  }
})
