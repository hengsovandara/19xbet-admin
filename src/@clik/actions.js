import { endpoints } from './configs'

export default ({ config, act, route, store, cookies, handle }) => ({
  APP_AREAS_FETCH: async data => {
    const { city, district, commune } = data || {}

    handle.loading(true)

    const result = await act('GET', {
      endpoint: 'areas',
      path: [city, district, commune].filter(item => item).join('/')
    })

    handle.loading()

    const areas = (result && result.data) || {}
    return areas
    // return store.set({ areas });
  },

  USER_TOKEN_SET: token => {
    token ? cookies.set('token', token) : cookies.remove('token');
    // console.log('USER TOKEN')
    // token ? route.set('merchants'))
    return store.set({ token })
  },

  USER_FETCH: async (token = cookies.get('token')) => {
    const result = await act('GQL', {
      query: `query { Users( where: { credential: { sessions: { token: {_eq: "${token}"}} }}) { id role name photo } }`
    })
    const [user] = result.Users
    store.set({ user });
    return user
  },

  ENUMS_FETCH: async () => {
    const businessTypes = await act('GET', { endpoint: 'business' }).then(({ data }) => data)
    const enums = await act('GET', { url: endpoints.enums }).then(({ data }) => data)

    return {
      businessTypes,
      industries: enums.industries,
      jobTitles: enums.jobTitles,
      statuses: enums.statuses,
      incomes: enums.incomes,
      userStatus: ['Created', 'Active', 'Pending', 'Failed', 'Verified', 'Unverified', 'Blocked', 'Registered', 'Decline', 'Disable']
    }
  },

  APP_INIT: () => {
    const token = store.get('token')
    handle.loading(true)

    if (token) 
      return route.set('index', !route.get('login'))
        .then(() => act(['OPEN', 'USER_FETCH', 'ENUMS_FETCH'])
        .then(([socket, user, enums]) => store.set({ socket, user, enums, ready: true })))

    if (!route.get('login')) return route.set('login').then(() => act('CLOSE').then(store.set))

    return act('CLOSE').then(store.set)
  },

  APP_FILE_UPLOAD: async body => {
    handle.loading(true);
    const result = await act('GET', { endpoint: 'upload' })
    const { url } = result.data
    await act('PUT', { url, body: body.url || body })
    handle.loading();
    return url
  },

  USER_UPDATE: async function({ file, id }) {
    // Request
    const url = await act('APP_FILE_UPLOAD', file)
    const result = await act('GQL', {
      query: `
        mutation($values: Users_set_input, $id: uuid) {
          update_Users( _set: $values, where: { id: { _eq: $id } } ){
            returning { id role name photo }
          }
        }
      `,
      variables: { values: { photo: url }, id }
    })

    // Modify
    const {
      update_Users: {
        returning: [user]
      }
    } = result

    // Set
    return store.set({ user })
  },

})
