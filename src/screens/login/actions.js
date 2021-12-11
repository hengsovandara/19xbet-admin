const actions = ({ store, act, handle }) => ({
  USER_LOGIN: async body => {
    handle.loading(true)
    const result = await act('POST', { token: null, endpoint: 'login', body })
    // console.log({result})
    const { token } = result?.data || {}
    return act('USER_TOKEN_SET', token)
  },
})

export default actions
