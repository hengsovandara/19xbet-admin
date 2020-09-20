export const actions = ({ act, store, action, handle }) => ({
  MERCHANTS_UNSUB: () => {
    Promise.all([act('UNSUB', { id: 'merchants' }), act('UNSUB', { id: 'merchants_count' }), act('UNSUB', { id: 'merchant' })])
  },

  MERCHANTS_COUNT_SUB: async ({ statusId, name }) => {
    const id = 'merchants_count'
    await act('UNSUB', { id })

    const ALL_MERCHANTS = `
      Merchants_aggregate {
        aggregate {
          count
        }
      }
    `

    const COUNT_BY_STATUS = `
      Merchants_aggregate(where: {status: {_eq: "${statusId}"}}) {
        aggregate {
          count
        }
      }
    `

    const COUNT_BY_NAME = `
      Merchants_aggregate(where: {name: {_ilike: "%${name}%"}}) {
        aggregate {
          count
        }
      }
    `

    const MERCHANT_COUNT = ((statusId && statusId !== 10) || statusId == 0) ? COUNT_BY_STATUS : name
      ? COUNT_BY_NAME
      : ALL_MERCHANTS

    return act('SUB', {
      id,
      query: `subscription {
        count: ${MERCHANT_COUNT}
      }`,
      action: ({ aggregate: { count } }) => store.set({ merchantsCount: count })
    })
  },

  MERCHANTS_SUB: async ({ offset = 0, limit = 15, statusId = undefined, name = undefined }) => {

    act('MERCHANTS_COUNT_SUB', { statusId, name })

    store.get('merchants') && await act('UNSUB', { id: 'merchants' })

    const ALL_MERCHANTS = `Merchants(limit:${limit} offset:${offset} order_by:{ createdAt:desc })`
    const SORT_BY_STATUS = `Merchants(limit:${limit} offset:${offset} order_by: {createdAt: desc} where: {status: {_eq: "${statusId}"}})`
    const SORT_BY_NAME = `Merchants(limit:${limit} offset:${offset} order_by: {createdAt: desc}, where: {name: {_ilike: "%${name}%"}})`

    const MERCHANTS = ((statusId && statusId !== 10) || statusId == 0) ? SORT_BY_STATUS : name
      ? SORT_BY_NAME
      : ALL_MERCHANTS

    handle.loading(true)

    return act('SUB', {
      id: 'merchants',
      query: `subscription {
        ${MERCHANTS} {
          id status name description createdAt
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

  MERCHANTS_SET: res =>
    new Promise(
      resolve =>
        res &&
        resolve(
          res.map(item => {
            const { businessTypes, userStatus } = store.get('enums')
            let percentage = 0

            const str = item.addresses.length && item.addresses[0]

            const data = {
              source: 'merchant',
              sector: 'Food & Beverage',
              size: 'small',
              type: 'Sole Proprietorship',
              address: item.addressName || str.city && str.district && str.commune && (str.city + ", " + str.district + ", " + str.commune) || '',
              ...item
            }

            const businessType = businessTypes && businessTypes.find(type => type.name === data.type)
            const businessTypeDocuments = businessType && businessType.documents

            const stats = {
              required: businessTypeDocuments && businessTypeDocuments.length,
              provided: item.documents && item.documents.filter(({ url }) => url).length
            }

            stats.percentage = parseInt((stats.provided / stats.required) * 100)

            const collections = [data.name, data.description, data.coverUrl, data.logoUrl, data.addressName]

            collections.map(collection => {
              if (!collection) {
                percentage -= 0
              } else {
                percentage += 100 / collections.length
              }
            })

            return {
              ...data,
              status: userStatus && userStatus[data.status],
              name: data?.name || data?.companyName || 'N/A',
              stats,
              percentage,
              businessTypeDocuments,
              createdAt: setDate(item.createdAt)
            }

            function setDate(timestamp) {
              if (!timestamp) return 'N/A'

              const date = new Date(timestamp)
              date.setHours(date.getHours() + 14)
              return date
                .toISOString()
                .split('.')
                .shift()
                .split('T')
                .join(' ')
            }
          })
        )
    ).then(merchants => store.set({ merchants, loading: false }))
})
