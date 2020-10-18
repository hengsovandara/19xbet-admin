import { setDate, setAddress, setName } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  CONSUMERS_UNSUB: async () => act('UNSUB', { id: 'consumers' }),

  CONSUMERS_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 2) => {
    await act('APP_SOCKET_CHECK')
    store.get('consumers') && await act('CONSUMERS_UNSUB')

    const search = Boolean(keywords) ? `{ _or: [
      ${keywords.split(' ').map(word => `
        { name: {_ilike: "%${word}%"}},
        { walletId: {_ilike: "%${word}%"}},
        { phoneNumber: {_ilike: "%${word}%"}}
      `).join('')}
    ]} ` : ''

    const condition = `where: { _and: [ ${search} ]}`

    return act('SUB', {
      id: 'consumers',
      query: `subscription {
        Users(limit: ${limit} offset: ${offset} order_by: { createdAt: desc } ${condition}) {
          id name email phoneNumber createdAt walletId
        }
      }`,
      action: data => act('CONSUMERS_SET', data, condition)
    })
  },

  CONSUMERS_SET: async (data, condition) => {
    // !store.get('loading') && handle.loading(true)
    const consumersCount = data.length

    const consumers = data && data.map(item => ({
      ...item,
      name: item.name,
      isWarning: (!!item.faces?.length && !item?.provisionId) || false,
      createdAt: setDate(item.createdAt),
      submittedAt: setDate(item.submittedAt),
      status: 'approved',
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
