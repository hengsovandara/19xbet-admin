export const actions = ({ store, act, handle }) => ({
  USER_LOGIN: async body => {
    handle.loading(true)
    const result = await act('POST', { token: null, endpoint: 'login', body })|| { data: {} }

    const { data: { token = '' } } = result

    if(!token){
      alert("លេខសំងាត់ឬលេខទូរស័ព្ទមិនត្រឹមត្រូវ")
      return act('USER_TOKEN_SET', token)
    }

    return act('USER_TOKEN_SET', token)
  },

})
