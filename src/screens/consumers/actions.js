import { setDate, setAddress, setName } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  CONSUMERS_UNSUB: async () => act('UNSUB', { id: 'consumers' }),

  CONSUMERS_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 2) => {
    await act('APP_SOCKET_CHECK')
    store.get('consumers') && await act('CONSUMERS_UNSUB')

    // handle.loading(true)
    const search = Boolean(keywords) ? `{ _or: [
      ${keywords.split(' ').map(word => `
        { givenName: {_ilike: "%${word}%"}},
        { surname: {_ilike: "%${word}%"}},
        { accountNumber: {_ilike: "%${word}%"}}
        ${!!parseInt(word) ? `{ contacts: {phoneNumber: {_eq: "${word}"}} }` : ''}
      `).join('')}
    ]} ` : ''

    const statusQuery = Boolean(status) ? `{ status: {_eq: ${status}} }` : ''

    const condition = `where: { _and: [
      ${statusQuery}
      {_or: [
        { _not: {assignments: {}}},
        { _not: {assignments: { finishedAt: { _is_null: true}}}}
      ]}
      ${search}
    ]}`

    return act('SUB', {
      id: 'consumers',
      query: `subscription {
        Consumers(limit: ${limit} offset: ${offset} order_by: { updatedAt: desc } ${condition}) {
          index id accountNumber status provisionId
          givenName surname
          createdAt updatedAt submittedAt
          addresses(order_by: { createdAt: desc } limit: 1) {
            commune district city houseNumber street postalCode country
          }
          contacts(order_by: { createdAt: desc } limit: 1) {
            phoneNumber countryCode
          }
          faces{ id }
        }
      }`,
      action: data => act('CONSUMERS_SET', data, condition)
    })
  },

  CONSUMERS_SET: async (data, condition) => {
    // !store.get('loading') && handle.loading(true)
    const consumersCount = await act('GQL', { query: `{ Consumers_aggregate(${condition}) { aggregate { count } } }` })
      .then(({ Consumers_aggregate: { aggregate: { count }}}) => count)

    const consumers = data && data.map(item => ({
      ...item,
      name: setName({ ...item, ...(item?.contacts[0] || {})}),
      address: setAddress(item?.addresses && item?.addresses[0] || {}),
      isWarning: (!!item.faces?.length && !item?.provisionId) || false,
      createdAt: setDate(item.createdAt),
      submittedAt: setDate(item.submittedAt),
      status: store.get('enums').statuses.find(status => status.value === item.status).text
    }))

    return store.set({ consumers, consumersCount, loading: null })
  },

  CONSUMERS_ASSIGN: async (consumerIds, user) => {
    handle.loading(true)
    const result = await act('GQL', {
      query: `mutation($objects: [Assignments_insert_input!]! ) { insert_Assignments(objects: $objects) { returning { id } } }`,
      variables: { objects: consumerIds.map(id => ({ consumerId: id, userId: user.value, finished: '', type: 'consumer', assignerId: store.get('user').id })) }
    }).catch(error => console.log(error))
  },

  CONSUMERS_ASSIGN_SELF: async ({ id }) => {
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
