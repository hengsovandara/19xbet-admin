const actions = ({ store, act, handle }) => ({
  USER_LOGIN: async body => {
    handle.loading(true)
    const result = await act('POST', { token: null, endpoint: 'login', body })

    const { token } = result?.data || {}
    return act('USER_TOKEN_SET', token)
  },

  USER_QR_FETCH: () => act('GET', { endpoint: 'qr' }).then(({ data }) => data),

  USER_SESSION_FETCH: async ({ session }) => {
    const result = await act('GET', { endpoint: 'qr', path: '/?session=' + session })
    const { token } = result.data
    return token && act('USER_TOKEN_SET', token)
  }
})

export default actions
