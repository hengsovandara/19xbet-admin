import { setDate } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  STAFF_UNSUB: async () => act('UNSUB', { id: 'staff' }),

  STAFF_SUB: async ({ offset = 0, limit = 15 }, keywords, status = 2) => {

    const search = Boolean(keywords) ? `{ _or: [
      { name: {_ilike: "%${keywords}%"}}
      ${!!parseInt(keywords) ? `{ contacts: {phoneNumber: {_eq: "${keywords}"}} }` : ''}
    ]} ` : ''

    const condition = `where: { _and: [
      ${search}
    ]}`

    const data = await act('GQL', { 
      query: `query {
        Staffs(order_by: { createdAt: desc } ${condition}) {
          role name email photo createdAt id phoneNumber
        }
      }`
    }).then(({Staffs}) => Staffs)

    return act('STAFF_SET', data, condition)
  },

  STAFF_SET: async (data, condition) => {
    const staffCount = data.length

    const staff = data && data.map(item => ({ ...item, createdAt: setDate(item.createdAt) }))

    return store.set({ staff, staffCount, loading: null })
  },

  USER_CREATE: async body => {
    if(!body.role || !body.email || !body.phoneNumber || !body.name){
      return Promise.reject('Please input all fields.')
    }

    const values = {
      password: body.pin,
      phoneNumber: body.phoneNumber,
      email: body.email,
      staff: {
        data: {
          ...body,
        }
      }
    }
    delete values['staff']['data']['pin']

    return act("GQL", {
      query: `
        mutation($values: [Credentials_insert_input!]!){
          insert_Credentials(objects: $values){
            returning{ role name email photo createdAt id phoneNumber }
          }
        }
      `,
      variables: { values }
    })
  }
})


