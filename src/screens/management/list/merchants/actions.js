import { setDate } from 'clik/libs'

export default ({ act, store, action, handle, cookies, route }) => ({
  MERCHANTS_UNSUB: async () => {
    await act('UNSUB', { id: 'merchants' })
    return store.set({ merchants: null })
  },

  TOTAL_COUNT_SUB: async({ name }) => {
    const id = 'merchants_count'
    await act('UNSUB', { id })

    const countByName = `
      Merchants_aggregate(
        where: { _or: [
          { name: {_ilike: "%${name}%"}},
          { companyName: {_ilike: "%${name}%"}}
        ]}
      ) {
        aggregate {
          count
        }
      }
    `

    const countByStatus = `
      Merchants_aggregate(where: {status: {_eq: 2}}) {
        aggregate {
          count
        }
      }
    `

    const totalCount = name ? countByName : countByStatus

    return act('SUB', {
      id,
      query: `subscription {
        count: ${totalCount}
      }`,
      action: ({ aggregate: { count } }) => store.set({ totalCount: count, loading: null })
    })
  },

  MERCHANTS_SUB: async ({ offset = 0, limit = 15, name = undefined }) => {
    await act('TOTAL_COUNT_SUB', { name })

    store.get('merchants') && await act('MERCHANTS_UNSUB')

    handle.loading(true)

    const byName = `where: { _or: [
      { name: {_ilike: "%${name}%"}},
      { companyName: {_ilike: "%${name}%"}}
    ]}`

    const byStatus = `where: { status: {_eq: 2}}`

    const condition = name ? byName : byStatus

    return act('SUB', {
      id: 'merchants',
      query: `subscription {
        Merchants(limit:${limit} offset:${offset} order_by:{ createdAt:desc } ${condition}) {
          id status name referenceId description createdAt submittedAt
          coverUrl logoUrl companyName
          openingHours
          facebookUrl websiteUrl flag
          addressName latitude longtitude hideAddress
          documents(order_by: { createdAt: asc }) { id name isChecked isValid url createdAt }
          addresses { city commune country district house }
        }
      }`,
      action: action('MERCHANTS_SET')
    })
  },

  MERCHANTS_SET: data => {
    return new Promise(
      resolve =>
        data &&
        resolve(
          data.map(item => {
            return {
              ...item,
              status: store.get('enums').statuses.find(status => status.value === item.status).text,
              name: item.name || item.companyName || 'N/A',
              address: setAddress(item.addresses),
              createdAt: setDate(item.createdAt),
              submittedAt: setDate(item.submittedAt)
            }

            function setAddress(addresses) {
              return addresses.map(address => address?.city && [address?.city, address?.district, address?.commune].filter(v => v && v.length).join(', ')).filter(address => !!address)
            }
          })
        )
    ).then(merchants => store.set({ merchants, loading: null }))
  }
})
