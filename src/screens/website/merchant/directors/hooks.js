export const actions = ({ act, store, action, handle, cookies, route }) => ({
  DELETE_DIRECTOR: async ids => {
    if (!ids || !ids.length) return alert('Director Id is null')

    let formatIds = ''
    if(ids.length)
      ids.forEach((id, index) => { formatIds += index + 1 === ids.length ? `"${id}"` : `"${id}",` });
    else
      formatIds = `"${ids}"`

    const query = `
      mutation {
        delete_Directors(where: {id: { _in: [${formatIds}]}}) {
          affected_rows
        }
      }
    `

    await act('GQL', { query })
  },

  UPDATE_MERCHANT: body => {
    const { id } = body || {}

    if (!id) return Promise.reject('Can not update none existing Merchant.')

    if (isSameObject(body, store.get('merchant'))) return Promise.reject('Same value')

    handle.loading(true)

    return act('POST', { endpoint: 'ekym', body })
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