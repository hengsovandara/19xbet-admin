import { endpoints } from './configs'
import { fetch } from 'fetchier'

export default ({ config, act, route, store, cookies, handle }) => ({
  APP_COUNTRIES_FETCH: async data => {
    handle.loading(true)

    const result = await act('GET', { endpoint: 'countries'})

    handle.loading()
    const countries = (result && result.data) || {}
    return countries
  },

  APP_AREAS_FETCH: async data => {
    const {city, district, commune } = data || {}

    handle.loading(true)

    const result = await act('GET', {
      endpoint: 'areas',
      path: [city, district, commune].filter(item => item).join('/')
    })

    handle.loading()

    return result?.data || {}
    // return store.set({ areas });
  },

  USER_TOKEN_SET: token => {
    token ? cookies.set('token', token) : cookies.remove('token')
    store.set({ token })
    return act('APP_INIT')
  },

  USER_FETCH: async (token = cookies.get('token')) => {
    const result = token && await act('GQL', {
      query: `query { Users( where: { credential: { sessions: { token: {_eq: "${token}"}} }}) { id role name photo credential {
        corporation { apiKey rules { id tampering face liveness } }
      } } }`
    })
    const [user = {}] = result && result.Users || []
    return user
  },

  ENUMS_FETCH: async () => {
    // const businessTypes = await act('GET', { endpoint: 'business' }).then(({ data }) => data)
    const enums = await act('GET', { url: endpoints.enums }).then(({ data }) => data)

    return enums
  },

  APP_SOCKET_CHECK: async () => {
    if(store.get().socket.readyState !== 1) {
      act('USER_TOKEN_SET')
      throw 'socket is closed'
    }
  },

  APP_INIT: async () => {
    const token = cookies.get('token')
    if(token && store.get('ready')) return

    if(token){
      handle.loading(true)
      return route.set('index', !route.get('login'))
        .then(() => act(['OPEN', 'USER_FETCH', 'ENUMS_FETCH', 'APP_COUNTRIES_FETCH'])
        .then(async ([socket, user, enums, countries]) => {
          const users = await act('USERS_FETCH', user)
          const [counts, stats] = await act('STATS_FETCH', user)
          const { corporation } = user?.credential
          store.set({ socket, counts, user, enums, users, stats, corporation, countries, ready: true })
          return act('STATS_SUB', user)
        })).catch(() => act('USER_TOKEN_SET'))
    }

    act('STATS_UNSUB')

    if (!route.get('login'))
      return route.set('login').then(() => act('CLOSE').then(store.set))
    return act('CLOSE').then(store.set)
  },

  APP_FILE_UPLOAD: async body => {
    handle.loading(true)
    const result = await act('GET', { endpoint: 'upload' })
    const { url } = result.data
    await fetch(url, { method: 'PUT', body: body.url || body })
    // await act('PUT', { url, body: body.url || body })
    handle.loading()
    return url
  },

  USERS_FETCH: user => act('GQL', {
    query: `query { Users(where: { role: { _neq: "admin" } }) { id role name photo } }`
  }).then(({ Users }) => Users),

  USER_UPDATE: async function ({ file, id }) {
    const url = await act('APP_FILE_UPLOAD', file)
    const { update_Users: { returning: [user] } } = await act('GQL', {
      query: `
        mutation($values: Users_set_input, $id: uuid) {
          update_Users( _set: $values, where: { id: { _eq: $id } } ){
            returning { id role name photo }
          }
        }
      `,
      variables: { values: { photo: url }, id }
    })

    return user && store.set({ ...store.get('user'), ...user })
  },

  STATS_SUB: user => Promise.all([
    act('SUB', {
      id: 'unassignedConsumersCount',
      query: `subscription { Consumers_aggregate(where: { _and: [{ status: {_eq: 2} }, {_or: [
        { _not: {assignments: {}}},
        { _not: {assignments: { finishedAt: { _is_null: true}}}}
      ]} ]}) { aggregate { count } } }`,
      action: ({ aggregate: { count } }) => store.get('counts').unassignedConsumers !== count && store.set({ counts: { ...store.get('counts'), unassignedConsumers: count }})
    }),
    act('SUB', {
      id: 'requestedConsumersCount',
      query: `subscription { Consumers_aggregate(where: { _and: [{ status: {_eq: 3} }, {_or: [
        { _not: {assignments: {}}},
        { _not: {assignments: { finishedAt: { _is_null: true}}}}
      ]} ]}) { aggregate { count } } }`,
      action: ({ aggregate: { count } }) => store.get('counts').requestedConsumers !== count && store.set({ counts: { ...store.get('counts'), requestedConsumers: count }})
    }),
    act('SUB', {
      id: 'assignedAssignmentsCount',
      query: `subscription { Assignments_aggregate(where: { _and: [{finishedAt: {_is_null: true}}, { userId: {_eq: "${user.id}"}}, { consumer: { status: {_eq: 2} }} ]}) { aggregate { count } } }`,
      action: ({ aggregate: { count } }) => store.get('counts').assignedAssignments !== count && store.set({ counts: { ...store.get('counts'), assignedAssignments: count }})
    }),
    act('SUB', {
      id: 'teamedAssignmentsCount',
      query: `subscription { Assignments_aggregate(where: {userId: {_is_null: true}, role: {_eq: "${user.role}"}}) { aggregate { count } } }`,
      action: ({ aggregate: { count } }) => store.get('counts').teamedAssignments !== count && store.set({ counts: { ...store.get('counts'), teamedAssignments: count }})
    }),
    act('SUB', {
      id: 'processingAssignmentsCount',
      query: `subscription { Assignments_aggregate(where: { userId: {_is_null: false} finishedAt: {_is_null: true}}) { aggregate { count } } }`,
      action: ({ aggregate: { count } }) => store.get('counts').processingAssignments !== count && store.set({ counts: { ...store.get('counts'), processingAssignments: count }})
    })
  ]),

  STATS_UNSUB: () => Promise.all([
    act('UNSUB', { id: 'unassignedConsumersCount' }),
    act('UNSUB', { id: 'requestedConsumersCount' }),
    act('UNSUB', { id: 'assignedAssignmentsCount' }),
    act('UNSUB', { id: 'teamedAssignmentsCount' }),
    act('UNSUB', { id: 'processingAssignmentsCount' })
  ]),

  STATS_FETCH: user => act('GQL', {
    query: `
      {
        consumersOverall: Consumers_aggregate{ aggregate{ count } }
        comsumersPending: Consumers_aggregate(where: { status: { _eq: 2}}){ aggregate{ count } }
        comsumersActive: Consumers_aggregate(where: { status: { _eq: 1}}){ aggregate{ count } }
        comsumersDeclined: Consumers_aggregate(where: { status: { _eq: 8}}){ aggregate{ count } }

        merchantsOverall: Merchants_aggregate{ aggregate{ count } }
        merchantsPending: Merchants_aggregate(where: { status: { _eq: "2"}}){ aggregate{ count } }
        merchantsActive: Merchants_aggregate(where: { status: { _eq: "1"}}){ aggregate{ count } }
        merchantsDeclined: Merchants_aggregate(where: { status: { _eq: "8"}}){ aggregate{ count } }

        unassignedConsumers: Consumers_aggregate(where: { _and: [{ status: {_eq: 2} }, {_or: [
          { _not: {assignments: {}}},
          { _not: {assignments: { finishedAt: { _is_null: true}}}}
        ]} ]}) { aggregate { count } }
        requestedConsumers: Consumers_aggregate(where: { _and: [{ status: {_eq: 3} }, {_or: [
          { _not: {assignments: {}}},
          { _not: {assignments: { finishedAt: { _is_null: true}}}}
        ]} ]}) { aggregate { count } }
        assignedAssignments: Assignments_aggregate(where: { _and: [{finishedAt: {_is_null: true}}, { userId: {_eq: "${user.id}"}}, { consumer: { status: {_eq: 2} }} ]}) { aggregate { count } }
        teamedAssignments: Assignments_aggregate(where: {userId: {_is_null: true}, role: {_eq: "${user.role}"}}) { aggregate { count } }
        processingAssignments: Assignments_aggregate(where: { userId: {_is_null: false} finishedAt: {_is_null: true}}) { aggregate { count } }
        unassignedMerchants: Merchants_aggregate(where: {_not: {assignments: {}}}) { aggregate { count } }
      }
    `
  }).then(stats => {
    const data = Object.keys(stats).reduce((obj, key) => ({ ...obj, [key]: stats[key].aggregate.count }), {})

    return [data, [
      {
        label: 'assignments',
        total: data.unassignedConsumers,
        pedingNumber: data.teamedAssignments,
        activatedNumber: data.assignedAssignments,
        declinedNumber: data.completedAssignments
      },
      {
        label: 'consumers',
        total: data.consumersOverall,
        pendingNumber: data.comsumersPending,
        activatedNumber: data.comsumersActive,
        declinedNumber: data.comsumersDeclined,
      },
      {
        label: 'merchants',
        total: data.merchantsOverall,
        pendingNumber: data.merchantsPending,
        activatedNumber: data.merchantsActive,
        declinedNumber: data.merchantsDeclined
      }
    ]]
  }),

  APP_INFO: async (data, type = 'error') => {
    const message = data && data.message || data.payload && data.payload.error || data
    const info = { message, type }
    // return store.set({ info: (store.get('info') || []).concat([error]), loading: false })
    return store.set({ info, loading: false })
  },
  APP_CONFIRM: async confirm => confirm === true ? (store.get('confirm')(), store.set({ confirm: null })) : store.set({ confirm }),
  APP_POPUP: async (children, props = {}) => store.set({ popup: children ? { children, ...props } : null }),
  APP_LOADING: async loading => store.set({ loading }),
  APP_CLEAR: async () => store.set({ loading: null, info: null, confirm: null, error: null }),
  APP_IMAGE: (url, provider) => {
    provider = provider || store.get('corporation').apiKey
    return url && provider ? config.endpoints.image + url + '&provider=' + provider + '&token=' + cookies.get('token') : ''
  }

})
