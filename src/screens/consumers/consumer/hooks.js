export const actions = ({ act, store, action, handle, cookies, route }) => ({
  CONSUMER_UNSUB: () => {
    act('UNSUB', { id: 'consumer' })
    return store.set({ consumer: null })
  },

  CONSUMER_SUB: async id => {
    act('CONSUMER_UNSUB')

    handle.loading(true)

    return act('SUB', {
      id: 'consumer',
      query: `subscription {
        Consumer(where: { id: { _eq: "${id}"}}) { 
          id status referenceId assignmentId
          firstName lastName fullName gender dateOfBirth nationality
          documentNumber documentExpiredDate identityDocumentType
          liveness faceMatchPercentage isFaceMatch
          isLiveVDO isFaceMatch
          createdAt updatedAt
          source note flag reason
          tamperingPhysical tamperingDigital
          commune district city
          amazonS3IdDocument amazonS3FaceImage amazonS3FaceVideo
          latitude longitude houseNumber street postalCode placeOfBirth countryCode documentIssueDate
          extraInfo
          jobTitle income industry
          activities(order_by: {createdAt: desc}){
            id note createdAt data owner { name id }
          }
          mrz { 
            firstName gender lastName dateOfBirth documentExpiredDate 
            documentNumber id identityDocumentType nationality 
          }
          ocr { 
            id identityDocumentType tamperingDigital tamperingPhysical gender 
            lastName firstName dateOfBirth amazonS3IdDocument documentExpiredDate 
            documentNumber city nationality createdAt address
          }
          corporation { logo name }
        }
      }`,
      action: action('CONSUMER_SET')
    })
  },

  CONSUMER_SET: ([item]) =>
    new Promise(resolve => {
      const amazonS3FaceImage =
        item.amazonS3FaceImage && ~item.amazonS3FaceImage.includes(',')
          ? item.amazonS3FaceImage.replace(/{|}/g, '').split(',')[0]
          : item.amazonS3FaceImage

      const collections = [
        item.faceMatchPercentage > 80,
        item.liveness > 80,
        item.tamperingPhysical < 80,
        item.tamperingDigital < 80,
        !item.isBlacklisted,
        item.identityDocumentType,
        item.lastName,
        item.firstName,
        item.gender,
        item.dateOfBirth,
        item.documentExpiredDate,
        item.nationality,
        item.city,
        item.district,
        item.commune
      ]

      let percentage = 0
      collections.map(collection => {
        if (!validate(collection)) percentage += 100 / collections.length
      })

      return resolve({
        ...item,
        amazonS3FaceImage,
        faceMatchPercentage: parseInt(item.faceMatchPercentage),
        tamperingPhysical: parseInt(item.tamperingPhysical),
        tamperingDigital: parseInt(item.tamperingDigital),
        percentage: Math.round(percentage)
        // status: store.get('enums').userStatus[item.status || 0]
      })

      function validate(value) {
        return value === '' ||
          value === null ||
          value === undefined ||
          value === false
          ? true
          : false
      }
    }).then(consumer => store.set({ consumer })),

  CONSUMER_UPLOAD: async (file, { name, data }) => {
    handle.loading(true)
    const url = await act('APP_FILE_UPLOAD', file)
    return act('CONSUMER_UPDATE', {
      [name === 'selfie' ? 'amazonS3FaceImage' : 'amazonS3IdDocument']: url,
      id: data.id
    })
  },

  CONSUMER_UPDATE: body => {
    const { id, status } = body || {}

    // console.log("body", body)

    let { dateOfBirth, documentExpiredDate, city, district, commune } =
      body || {}

    if (!commune && !district && city) {
      // console.log('hasCity')
      body = { ...body, district: null, commune: null }
    } else if (!commune && district && !city) {
      // console.log('hasDistrict')
      body = { ...body, commune: null }
    }

    if (dateOfBirth) {
      dateOfBirth = dateOfBirth
        .split('/')
        .reverse()
        .join('-')
      body = { dateOfBirth, id }
    }

    if (documentExpiredDate) {
      documentExpiredDate = documentExpiredDate
        .split('/')
        .reverse()
        .join('-')
      body = { documentExpiredDate, id }
    }

    if (!id) return Promise.reject('Can not update none existing EKYC')

    if (isSameObject(body, store.get('consumer')))
      return Promise.reject('Same value')

    const needConfirmation = status !== undefined
    const redirect = status === 8

    handle.loading(true)

    const updateAction = () =>
      act('POST', { endpoint: 'ekyc', body }).then(
        () => needConfirmation && route.set('consumers')
      )

    return needConfirmation && !redirect
      ? handle.confirm(updateAction)
      : updateAction()
  },

  CONSUMER_ASSIGN: async ({ verificationId }) => {
    const { id } = store.get('user') || {}

    const query = `
      mutation {
        insert_Consumer(
          objects:{
            id: "${verificationId}"
            assignment: {
              data: {
                type: "consumer",
                userId: "${id}"
              }
            }
          },
          on_conflict: {
            constraint: Consumer_pkey
            update_columns: [assignmentId]
          }
        ){
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
    }`

    await act('GQL', { query })
    // const data = result && result.insert_Consumer.returning[0];
    // return data;
  },

  CONSUMER_UNASSIGN: async ({ verificationId, assignmentId }) => {
    const finishedAt = new Date().toISOString().split('.')[0]

    const query = `
      mutation {
        update_Consumer(where: {id: {_eq: "${verificationId}"}}, _set: {assignmentId: null}) {
          returning {
            assignmentId
          }
        }

        update_Assignment(where: {id: {_eq: "${assignmentId}"}}, _set: {finishedAt: "${finishedAt}"}) {
          returning {
            finishedAt
          }
        }
      }    
    `

    await act('GQL', { query })
  }
})

function isSameObject(obj, prevObj) {
  const keys = Object.keys(obj)
  const prevValues = keys.reduce((obj, key) => {
    obj[key] = prevObj[key]
    return obj
  }, {})

  return JSON.stringify(obj) === JSON.stringify(prevValues)
}
