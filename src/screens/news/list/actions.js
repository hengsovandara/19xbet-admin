import { setDate, setName, setAddress } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  NEWS_FETCH: async ({ offset = 0, limit = 15 }, keywords) => {

    const search = Boolean(keywords) ? `{ _or: [
      ${keywords.split(' ').map(word => `
        { name: {_ilike: "%${word}%"}},
        { walletId: {_ilike: "%${word}%"}},
        { phoneNumber: {_ilike: "%${word}%"}}
      `).join('')}
    ]} ` : ''

    const condition = `where: { _and: [ ${search} ]}`

    const data = await act('GQL', {
      query: `query {
        News(limit: ${limit} offset: ${offset} order_by: { createdAt: desc } ${condition}) {
          id title content imageUrl createdAt staff { id name photo }
        }
      }`
    }).then(({News}) => News)
    return act('NEWS_SET', data, condition)
  },

  NEWS_SET: async (data, condition) => {
    const newsCount = await act('GQL', { query: `{ News_aggregate(${condition}) { aggregate { count } } }` })
    .then(({ News_aggregate: { aggregate: { count }}}) => count)

    const news = data && data.map(item => ({
      ...item,
      createdAt: setDate(item.createdAt)
    }))
    return store.set({ news, newsCount, loading: null })
  },
  
  TRANSACTIONS_UPDATE: async (data) => {
    const query = `
      mutation{
        update_Transactions(where: {_and:[{ status: { _eq: "requested"}}, {id: { _eq: "${data.id}"}}]} _set: {
          staffId: "${data.staffId}", status: "${data.status}" acceptedAt: "now()"
        }){
          affected_rows
        }
      }
    `
    await act("GQL", { query }).then(data).catch(err => alert(JSON.stringify(err, 0, 2)))
    return
  } 
})
