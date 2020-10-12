import { setDate, setName, setAddress } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  REPORTS_FETCH: async ({ offset = 0, limit = 15 }, keywords, status) => {
    const search = Boolean(keywords) ? `{ _or: [
      { consumer: { givenName: {_ilike: "%${name}%"}} },
      { consumer: { surname: {_ilike: "%${name}%"}} },
      { consumer: { accountNumber: {_ilike: "%${keywords}%"}} }
      ${!!parseInt(keywords) ? `{ consumer: { contacts: {phoneNumber: {_eq: "${keywords}"}} } }` : ''}
    ]} ` : ''

    const statusQuery = status ? `, consumer: { status: {_eq: ${status}} }` : ''

    // const condition = `where: {_and: {finishedAt: {_is_null: true}} ${statusQuery}, userId: {_eq: "${store.get('user').id}"} ${search}}`
    const condition = `where: { _and: [{ status: { _eq: "accepted"}}]}`

    return act('GQL', {
      query: `{
        Transactions(limit:${limit} offset:${offset} order_by:{ createdAt: desc } ${condition}) {
          id type method imageUrl amount createdAt userId index status acceptedAt
          user{ id name email phoneNumber }
          staff { id name }
        }
      }`
    }).then(({Transactions}) => act('REPORTS_SET', Transactions))
  },

  REPORTS_SET: (data) => {
    const totalAmount = data.reduce((total, item) => {
      if(item.type === 'cashin')
        total += item.amount
      else
        total += item.amount
      return total
    },0)

    data = data && data.map(item => ({
      ...item,
      createdAt: setDate(item?.createdAt),
      acceptedAt: setDate(item?.acceptedAt)
    }))
    return store.set({ reports: {data, totalAmount}, loading: null })
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
