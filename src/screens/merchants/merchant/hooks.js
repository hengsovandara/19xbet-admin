import queries from './queries'
import { GQL_URL } from '../../../@clik/configs'

export const actions = ({ act, store, action, handle, cookies, route }) => ({
  MERCHANT_UNSUB: () => {
    store.get('merchant') && act('UNSUB', { id: 'merchant' })
    return store.set({ merchant: null })
  },

  MERCHANT_SUB: async id => {
    await act('MERCHANT_UNSUB')

    handle.loading(true)

    return act('SUB', {
      id: 'merchant',
      query: `subscription {
        Merchants(where: { id: { _eq: "${id}"}}) {
          id status name referenceId description createdAt
          coverUrl logoUrl openingHours
          facebookUrl websiteUrl flag
          addressName latitude longtitude hideAddress
          incorporationCountry registrationNumber businessActivities businessId companyName incorporationDate
          documents(order_by: { createdAt: asc }) { id name isChecked isValid url createdAt }
          activities(order_by: {createdAt: desc}){ id note createdAt data owner { name id }}
          addresses { id type city commune country district house }
          business { id name documents }
          shareholders {
            id merchantId shareholderMerchantId shareholderConsumerId type merchantData consumerData created_at updated_at
            shareholderConsumer {
              id status referenceId phoneNumber
              firstName lastName fullName gender dateOfBirth nationality email flag
              documentNumber documentExpiredDate identityDocumentType selectedCountry
              liveness faceMatchPercentage isFaceMatch
              isLiveVDO isFaceMatch
              createdAt updatedAt
              source note state
              tamperingPhysical tamperingDigital
              commune district city address industry jobTitle income
              amazonS3IdDocument amazonS3FaceImage amazonS3FaceVideo
              latitude longitude houseNumber street postalCode placeOfBirth countryCode documentIssueDate
            }
            shareholderMerchant {
              id status name referenceId description createdAt type
              coverUrl logoUrl
              openingHours
              facebookUrl websiteUrl flag
              addressName latitude longtitude hideAddress
              documents(order_by: {createdAt: asc}) { id name isChecked isValid url }
              addresses { id country city commune district house street type merchantId postalCode }
            }
          }
          directors {
            id data consumerId createdAt merchantId updatedAt
            consumer {
              id status referenceId phoneNumber
              firstName lastName fullName gender dateOfBirth nationality email flag
              documentNumber documentExpiredDate identityDocumentType selectedCountry
              liveness faceMatchPercentage isFaceMatch
              isLiveVDO isFaceMatch
              createdAt updatedAt
              source note state
              tamperingPhysical tamperingDigital
              commune district city address industry jobTitle income
              amazonS3IdDocument amazonS3FaceImage amazonS3FaceVideo
              latitude longitude houseNumber street postalCode placeOfBirth countryCode documentIssueDate
            }
          }
        }
      }`,
      action: action('MERCHANT_SET')
    })
  },

  MERCHANT_SET: ([item]) =>
    new Promise(resolve => {
      const { businessTypes, userStatus } = store.get('enums')
      let percentage = 0

      const data = {
        source: 'merchant',
        sector: 'Food & Beverage',
        size: 'small',
        type: 'Sole Proprietorship',
        address: item && item.addressName,
        ...item
      }

      const businessType = businessTypes && businessTypes.find(type => type.name === data.type)
      const businessTypeDocuments = businessType && businessType.documents

      const stats = {
        required: businessTypeDocuments && businessTypeDocuments.length,
        provided: item.documents && item.documents.filter(({ url }) => url).length
      }

      stats.percentage = parseInt((stats.provided / stats.required) * 100)

      const collections = [data.name, data.description, data.coverUrl, data.logoUrl, data && data.addressName]

      collections.map(collection => {
        if (!collection) {
          percentage -= 0
        } else {
          percentage += 100 / collections.length
        }
      })

      return resolve({
        merchant: {
          ...data,
          status: userStatus[data.status],
          name: data.name || 'N/A',
          stats,
          percentage,
          businessTypeDocuments,
          createdAt: setDate(item.createdAt)
        }
      })

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
    }).then(store.set),

  MERCHANT_UPDATE: body => {
    const { id, status } = body || {}

    if (!id) return Promise.reject('Can not update none existing Merchant.')

    if (isSameObject(body, store.get('merchant'))) return Promise.reject('Same value')

    const needConfirmation = status !== undefined

    handle.loading(true)

    const updateAction = () => act('POST', { endpoint: 'ekym', body }).then(() => needConfirmation && route.set('merchants'))

    return needConfirmation ? handle.confirm(updateAction) : updateAction()
  },

  VERIFY_MERCHANT: body => {
    if (!body.id) return console.warn('Cannot verify none existing merchant!')
    const token = cookies.get('token')

    if (isSameObject(body, store.get('merchant'))) return Promise.reject('Same value')

    const needConfirmation = status !== undefined

    handle.loading(true)

    const updateAction = () => act('POST', { endpoint: 'ekym', body, token }).then(() => needConfirmation && route.set('merchants'))

    return needConfirmation ? handle.confirm(updateAction) : updateAction()
  },

  ADD_NEW_DOCUMENT: (merchantId, documentName, documentURL, isVerified, isChecked) => {
    if (!merchantId || !documentName || !documentURL) return console.log('Add new document failed!')
    const token = cookies.get('token')
    console.log("q", queries.upsert('Documents', ['merchantId', 'name', 'url', 'isValid', 'isChecked']))
    const body = {
      query: queries.upsert('Documents', ['merchantId', 'name', 'url', 'isValid', 'isChecked']),
      variables: {
        values: {
          name: documentName,
          url: documentURL,
          isChecked: isChecked,
          isValid: isVerified,
          merchantId
        }
      }
    }

    return act('POST', { url: GQL_URL, body, token })
  },

  UPDATE_DOCUMENT: (documentId, documentName, documentURL, isVerified) => {
    if (!documentId || !documentName) return console.log('Update document failed!')

    let arr = ['name', 'url', 'isChecked', 'isValid']
    let variables = { values: { id: documentId, name: documentName, url: documentURL, isChecked: true, isValid: isVerified } }

    if (!documentURL) {
      console.log('No URL')
      arr = ['name', 'isChecked', 'isValid']
      variables = { values: { id: documentId, name: documentName, isChecked: true, isValid: isVerified } }
    }

    const token = cookies.get('token')
    const body = {
      query: queries.upsert('Documents', arr, { id: documentId }),
      variables
    }

    return act('POST', { url: GQL_URL, body, token })
  },

  DELETE_DOCUMENT: async documentId => {
    if (!documentId) return console.log('Document not found!')

    const query = `
      mutation {
        delete_Document(where: {id: {_eq: "${documentId}"}}) {
          affected_rows
        }
      }
    `

    await act('GQL', { query })

  },

  UPLOAD_DOCUMENT: (merchantId, documentName, documentURL) => {
    if (!merchantId) return console.warn('Can not upload document to none existing Merchant')
    if (!documentURL) return console.warn('No document image to upload')
    if (!documentName) return console.warn('No type specified')

    // const url = props.file.url || props.file
    // const name = props.name
    const token = cookies.get('token')
    const body = {
      query: queries.upsert('Documents', ['name', 'url', 'merchantId']),
      variables: { values: { name: documentName, url: documentURL, merchantId } }
    }

    return act('POST', { url: GQL_URL, body, token })
  },

  CHANGE_DOCUMENT: (file, props) => {
    const { id, name } = (props && props.data) || {}

    file = file.url || file
    if (!id) return console.warn('Cannot change document to none existing merchant')
    const token = cookies.get('token')

    return act('GET', { endpoint: 'upload' }).then(({ data: { url } }) => {
      return act('PUT', { url, body: file }).then(() => {
        const body = {
          query: queries.upsert('Documents', ['name', 'url'], id),
          variables: { values: { id, name, url } }
        }

        return act('POST', { url: GQL_URL, body, token })
      })
    })
  },

  VERIFY_DOCUMENT: (id, documentId, name, isValid) => {
    if (!id && !name) return console.log('Cannot verify document none existing merchant!')

    const token = cookies.get('token')
    const body = {
      query: queries.upsert('Documents', ['name', 'isChecked', 'isValid'], (id = documentId)),
      variables: { values: { isValid, isChecked: true, id: documentId, name } }
    }

    return act('POST', { url: GQL_URL, body, token })
  },

  // UPDATE_DOCUMENT_NAME: (id, documentId, documentName) => {
  //   if (!id && !documentName) return console.log('Cannot update document!')
  //   const token = cookies.get('token')
  //   const body = {
  //     query: queries.upsert('Document', ['name'], { id: documentId }),
  //     variables: { values: { id: documentId, name: documentName } }
  //   }

  //   return act('POST', { url: GQL_URL, body, token })
  // },

  SEND_NOTE: (merchantId, ownerId, note) => {
    const token = cookies.get('token')
    const type = 'note'

    if (!merchantId) throw 'Cannot assign note to none existing merchant'

    const body = {
      query: queries.upsert('Activity', ['note', 'type', 'merchantId', 'ownerId']),
      variables: { values: { note, type, merchantId, ownerId } }
    }

    return act('POST', { url: GQL_URL, body, token })
  },

  GET_MERCHANT_BUSINESS: async (referenceId) => {
    if (!referenceId) return console.log('Cannot get merchant\'s data from CRM!')

    const data = await act('GET', { url: `https://node-test.clik.asia/portal/businesses/${referenceId}` }).then(({ data }) => data)
    return data
  },

  MERCHANT_ASSIGNMENT: async ({ merchantId }) => {
    const { id: userId } = store.get('user') || {}
    const finishedAt = new Date().toISOString().split('.')[0]
    const query = `
      mutation {
        insert_Merchants(objects: {id: "${merchantId}", assignment: {data: {type: "merchant", userId: "${userId}"}}}, on_conflict: {constraint: Merchant_pkey, update_columns: assignmentId}) {
          returning {
            id
            assignment {
              id
              user {
                id
                photo
              }
            }
          }
        }
      }
    `

    await act('GQL', { query })
  },

  MERCHANT_UNASSIGNMENT: async ({ merchantId, assignmentId }) => {
    const finishedAt = new Date().toISOString().split('.')[0]

    const query = `
      mutation {
        update_Merchants(where: {id: {_eq: "${merchantId}"}}, _set: {assignmentId: null}) {
          returning {
            assignmentId
          }
        }

        update_Assignments(where: {id: {_eq: "${assignmentId}"}}, _set: {finishedAt: "${finishedAt}"}) {
          returning {
            finishedAt
          }
        }
      }
    `

    await act('GQL', { query })
  },
})

function isSameObject(obj, prevObj) {
  const keys = Object.keys(obj)
  const prevValues = keys.reduce((obj, key) => {
    obj[key] = prevObj[key]
    return obj
  }, {})

  return JSON.stringify(obj) === JSON.stringify(prevValues)
}
