import { setDate } from '../../../@clik/libs'

export const actions = ({ act, store, action, handle }) => ({
  CONSUMERS_UNSUB: () => {
    Promise.all([act('UNSUB', { id: 'consumers' }), act('UNSUB', { id: 'consumers_count' }), act('UNSUB', { id: 'consumer' })])
  },

  CONSUMERS_COUNT_SUB: async ({ statusId, name }) => {

    const id = 'consumers_count'
    await act('UNSUB', { id })

    let GET_CONSUMERS_COUNT = `Consumer_aggregate { aggregate { count } }`
    if (!!statusId) GET_CONSUMERS_COUNT = `Consumer_aggregate(where: {status: {_eq: ${statusId}}}) { aggregate { count } }`
    if (statusId == 0) GET_CONSUMERS_COUNT = `Consumer_aggregate(where: {status: {_is_null: true }}) { aggregate { count } }`
    if (name) GET_CONSUMERS_COUNT = `Consumer_aggregate(where:{_or:[${generateKeywordsQuery(name)}]}) { aggregate { count } }`

    return act('SUB', {
      id,
      query: `subscription {
        count: ${GET_CONSUMERS_COUNT}
      }`,
      action: ({ aggregate: { count } }) => store.set({ consumersCount: count })
    })
  },

  CONSUMERS_SUB: async ({ offset, limit, statusId, name }) => {
    act('CONSUMERS_COUNT_SUB', { statusId, name })

    await act('UNSUB', { id: 'consumers' })

    handle.loading(true)

    const pagination = `limit:${limit} offset:${offset} order_by: { createdAt:desc_nulls_last }`

    let Consumer = `Consumer(${pagination})`
    if (name && !status) Consumer = `Consumer(order_by: {createdAt: desc_nulls_last}, where: {_or: [
      ${generateKeywordsQuery(name)}
    ]})`
    // `Consumer(where: { _or: [{firstName: { _ilike:"%${name}%"}}, {lastName: { _ilike:"%${name}%"}}]} ${pagination})`
    if (!!statusId && statusId != 0 && statusId != 10) Consumer = `Consumer(where: {status: {_eq: ${statusId} }} ${pagination})`
    if (statusId == 0) Consumer = `Consumer(where: {status: {_is_null: true }} ${pagination})`

    return act('SUB', {
      id: 'consumers',
      query: `subscription {${Consumer} { 
          id status source
          firstName lastName fullName gender nationality
          liveness faceMatchPercentage isFaceMatch isLiveVDO
          tamperingPhysical tamperingDigital
          dateOfBirth identityDocumentType documentExpiredDate
          createdAt updatedAt houseNumber street
          commune district city
          amazonS3IdDocument amazonS3FaceImage amazonS3FaceVideo
          assignment {
            id user { photo }
          }
          corporation { logo name }
        }
      }`,
      action: action('CONSUMERS_SET')
    })
  },

  CONSUMERS_SET: data =>
    new Promise(
      resolve =>
        data &&
        resolve(
          data.map(item => {
            const amazonS3FaceImage = item.amazonS3FaceImage && ~item.amazonS3FaceImage.includes(',') ? item.amazonS3FaceImage.replace(/{|}/g, '').split(',')[0] : item.amazonS3FaceImage

            const collections = [
              item.faceMatchPercentage > 80, item.liveness > 80, item.tamperingPhysical < 80,
              item.tamperingDigital < 80, !item.isBlacklisted,
              item.identityDocumentType, item.lastName, item.firstName, item.gender,
              item.dateOfBirth, item.documentExpiredDate, item.nationality,
              item.street, item.houseNumber,
              item.city, item.district, item.commune
            ]

            let percentage = 0
            collections.map(collection => {
              if (!validate(collection)) percentage += 100 / collections.length
            })

            return {
              ...item,
              amazonS3FaceImage,
              faceMatchPercentage: parseInt(item.faceMatchPercentage),
              tamperingPhysical: parseInt(item.tamperingPhysical),
              tamperingDigital: parseInt(item.tamperingDigital),
              percentage: Math.round(percentage),
              isMerchant: !!item.documents,
              match: item.faceMatchPercentage,
              name: setName(item),
              address: setAddress(item),
              createdAt: setDate(item.createdAt),
              source: item.source || (item.corporation && 'other') || 'clik',
              status: store.get('enums').userStatus[item.status || 0]
            }

            function validate(value) {
              return value === '' || value === null || value === undefined || value > 25 || value === false ? true : false
            }

            function setAddress({ city, district, commune, address }) {
              return (city && [city, district, commune].filter(v => v && v.length).join(', ')) || address
            }

            function setName({ firstName, lastName, fullName, name }) {
              return (lastName && firstName && lastName + ' ' + firstName) || fullName || name || 'N/A'
            }
          })
        )
    ).then(consumers => store.set({ consumers }))
})

const generateKeywordsQuery = keywords => {
  const arr = keywords.replace(/[^a-zA-Z0-9 ]/g, "").split(" ")
  const startName = arr[0]
  const endName = !!arr[1] ? arr[1] : ''

  return `
  { _and: [{firstName: {_ilike: "%${startName}%"}}, {lastName: {_ilike: "%${endName}%"}}] },
  { _and: [{firstName: {_ilike: "%${endName}%"}}, {lastName: {_ilike: "%${startName}%"}}] },
`
}