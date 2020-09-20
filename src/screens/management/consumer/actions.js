export default ({ act, store, action, handle, cookies, route, configs }) => ({
  CONSUMER_FETCH: async id => {
    const query = `query {
      Consumers(where: { id: { _eq: "${id}"}}) {
        id status accountNumber index
        givenName surname gender dateOfBirth nationality
        createdAt updatedAt
        source note flags reason
        extraInfo
        activities(order_by: {createdAt: desc}){
          id note createdAt data owner { name id }
        }
        contacts(order_by: { createdAt: desc } limit: 1) {
          phoneNumber countryCode
        }
        identities(order_by: { createdAt: desc } limit: 1) {
          url cropUrl
          mrz {
            givenName gender surname dateOfBirth dateOfExpiry
            number id type nationality
          }
          ocr {
            id type tamperingDigital tamperingPhysical
            gender givenName surname number city nationality createdAt
            url address dateOfExpiry dateOfBirth dateOfIssue placeOfBirth originalData
          }
        }
        screenings { types matches shareUrl }
        faces(order_by: { createdAt: desc } limit: 1) { id faceMatchPercentage imageUrl url liveness { percentage } }
        documents(order_by: { createdAt: desc } limit: 1) { number placeOfBirth type dateOfExpiry dateOfIssue }
        occupations(order_by: { createdAt: desc } limit: 1) { industry title income }
        addresses(order_by: { createdAt: desc } limit: 1) { country state city district commune street houseNumber postalCode }
        corporation { logo name extraInfo }
      }
      validations: Validations(where: {consumerId: {_eq: "${id}"}} order_by: {index: desc}) { id previousValue createdAt note status field userId value user { name } }
      notes: Notes(where: {consumerId: {_eq: "${id}"}} order_by: {createdAt: desc}) { id createdAt note userId user { name } }
    }`

    const { Consumers: [ consumer ], validations, notes } = await act('GQL', { query })

    const identity = consumer?.identities[0] || {}
    const document = consumer?.documents[0] || {}
    const address = consumer?.addresses[0] || {}
    const occupation = consumer?.occupations[0] || {}
    const face = consumer?.faces[0] || {}
    const screening = consumer?.screenings[0] || {}
    const contact = consumer?.contacts[0] || {}

    store.get('loading') && handle.loading()

    return [{
      ...consumer,
      // amazonS3FaceImage,
      ocr: identity?.ocr || {},
      mrz: identity?.mrz || {},
      identity: { ...identity, url: handle.image(identity?.url) },
      document,
      face: { ...face, imageUrl: handle.image(face?.imageUrl), url: handle.image(face?.url) },
      address,
      occupation,
      screening,
      contact,
      liveness: { percentage: parseInt(face?.liveness?.percentage * 100) }
    }, validations, notes]
  },

  CONSUMER_UPLOAD: async (file, { name, data }) => {
    handle.loading(true)
    const url = await act('APP_FILE_UPLOAD', file)
    act('CONSUMER_UPDATE', {
      [name === 'selfie' ? 'amazonS3FaceImage' : 'amazonS3IdDocument']: url,
      id: data.id
    })
  },

  CONSUMER_UPDATE: async body => {
    const { id, status } = body || {}

    if (!id) return Promise.reject('Can not update none existing EKYC')

    // if (isSameObject(body, store.get('consumer')))
    //   return Promise.reject('Same value')

    // const needConfirmation = status !== undefined
    // const redirect = status === 8

    handle.loading(true)

    // const updateAction = () => act('POST', { endpoint: 'ekyc', body })
    //   .then(() => needConfirmation && route.set(`management?type=consumer&id=${id}`))

    // return needConfirmation && !redirect ? handle.confirm(updateAction) : updateAction()


    act('POST', { endpoint: 'ekyc', body })
      .then(() => route.set(`/management?type=consumer&id=${id}`))
      .catch(console.log)
  },

  CONSUMER_ASSIGN: async ({ verificationId }) => {
    const { id } = store.get('user') || {}

    const query = `
      mutation {
        insert_Consumers(
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
            constraint: Consumers_pkey
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
        update_Consumers(where: {id: {_eq: "${verificationId}"}}, _set: {assignmentId: null}) {
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

  CONSUMER_INSERT_VALIDATIONS: async ({ consumerId, userId, validations }, rejectionNote) => {
    if((!validations.length || !consumerId || !userId) && !note)
      return handle.info('Missing data to insert')

    const body = {
      consumerId,
      userId,
      note: rejectionNote,
      validations: validations.filter(item => !item.userId && !!item.status).map(({ status, field, value, note, reason, previousValue }) => ({
        consumerId, userId,
        status, note, field,
        reason,
        previousValue,
        value: String(value)
      }))
    }
    console.log("body", body)

    act('POST', { endpoint: 'validations', body }).then(() => route.set('/management')).catch(action('APP_INFO'))
  },

  CONSUMER_INSERT_NOTE: async (body = {}) => {
    if(!body.note || !body.consumerId || !body.userId)
      return Promise.reject('Missing Data.')

    const query = `mutation($objects: [Notes_insert_input!]! ) {
      insert_Notes(objects: $objects) { returning { id } }
    }`

    return await act('GQL', { query, variables: { objects: body }})
      .catch(error => console.log(error))
  }
})
