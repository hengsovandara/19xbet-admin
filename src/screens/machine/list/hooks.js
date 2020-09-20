import { LIVENESS_AI } from 'clik/configs'

export const actions = ({ act, store, action, handle }) => ({
  UPDATE_FACE_LIVENESS: ({ face, data }) => {
    let obj = {
      id: face.liveness.id,
      prediction: data.prediction,
      percentage: data.percentage,
      details: data.details
    }

    act('GQL', {
      query: `
        mutation($obj:[datasets_Liveness_insert_input!]!) {
          insert_datasets_Liveness(objects:$obj on_conflict:{constraint:Liveness_pkey, update_columns: [details percentage prediction]}) {
            affected_rows
          }
        }
      `,
      variables: { obj }
    })
  },
  SUB_LATEST_TRAINING: () => {
    act('SUB', {
      id: 'training',
      query: `subscription {
        datasets_Trainings(order_by: {index: desc}, limit: 1) {
          statusText
          progressPercentage
          details
          start
          finish
          id
          index
          isError
          isOngoing
          location
        }
      }`,
      action: action('STORE_TRAINING_DATA')
    })
  },
  STORE_TRAINING_DATA: arr => store.set({ training: arr[0] }),
  FETCH_LIST_DATA: ({ limit, offset }) => {
    act('SUB', {
      id: 'faceVideos',
      query: `subscription {
        datasets_Faces(order_by: {createdAt: desc}, limit: ${limit}, offset: ${offset}) {
          classifications
          imageUrl
          id
          createdAt
          url
          liveness {
            id
            details
            percentage
            prediction
          }
          consumer {
            firstName: givenName
            lastName: surname
            id
            amazonS3FaceImage: faces(limit: 1) {
              url
            }
          }
        }
      }`,
      action: action('STORE_LIST_DATA')
    })
  },
  STORE_LIST_DATA: async data => {
    const { datasets_Faces_aggregate: { aggregate: { count } } } = await act('GQL', { query: '{ datasets_Faces_aggregate { aggregate { count } } }' })
    data = data.map(record => {
      record.url = record.url && handle.image(record.url)
      record.imageUrl = record.imageUrl && handle.image(record.imageUrl)
      if(record.consumer && record.consumer.amazonS3FaceImage.length) {
        record.consumer.url = handle.image(record.consumer.amazonS3FaceImage[0].url)
        delete record.consumer.amazonS3FaceImage
      }
      return record
    })
    store.set({ facesList: data, count })
  },
  LABEL_DATA: async ({ obj, bool }) => {
    if(!obj.url) return
    handle.loading(true)
    try {
      const url = `${LIVENESS_AI}/dev/dataset`
      const { data: datasetDetails } = await act('POST', {
        url,
        body: {
          type: bool ? 'real' : 'fake',
          urls: obj.url
        }
      })
      await act('GQL', {
        query: `mutation ($obj: [datasets_Faces_insert_input!]!) {
          insert_datasets_Faces(objects: $obj, on_conflict: {constraint: Faces_pkey, update_columns: [classifications details]}) {
            returning {
              id
            }
          }
        }`,
        variables: { obj: { id: obj.id, classifications: bool ? 'real' : 'fake', details: datasetDetails || null } }
      })
    } catch (e) {
      console.error(e)
      handle.loading()
    }
    handle.loading()
  }
})
