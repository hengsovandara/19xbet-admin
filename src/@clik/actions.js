import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/auth'
import { endpoints } from './configs'
import { fetch } from 'fetchier'

const Act = ({ config, act, route, store, cookies, handle }) => ({
  APP_COUNTRIES_FETCH: async data => {
    handle.loading(true)
    handle.loading()
    return {}
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
      query: `query { Staffs( where: { credential: { sessions: { token: {_eq: "${token}"}} }}) { id role name photo phoneNumber email } }`
    })
    const [user = {}] = result && result.Staffs || []
    return user
  },
  ENUMS_FETCH: async () => {
    const enums = await act('GQL', {
      query: `query { 
        transaction_types: enum_transaction_types{ id value description } 
        transaction_methods: enum_transaction_methods{ id value description } 
      }`
    }) || {}
    Object.keys(enums).map(enumKey => {
      enums[enumKey] = {
        byId: enums[enumKey].reduce((acc, value) => { acc[value.id] = value; return acc },{}),
        byList: enums[enumKey]
      }
    })
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
        .then(() => act(['OPEN', 'USER_FETCH', 'ENUMS_FETCH', 'APP_NOTIFICATIONS'])
        .then(async ([socket, user, enums, notification]) => {
          const users = await act('USERS_FETCH', user)
          const [counts, stats] = await act('STATS_FETCH', user)
          // console.log("notification notification", notification)
          store.set({ socket, counts, user, users, enums, stats, ready: true })
          handle.loading(false)
          // return act('STATS_SUB', user)
        })).catch(() => act('USER_TOKEN_SET'))
    }

    // act('STATS_UNSUB')

    if (!route.get('login'))
      return route.set('login').then(() => act('CLOSE').then(store.set))
    return store.set()
    // return act('CLOSE').then(store.set)
  },
  APP_NOTIFICATIONS: async () => {
    return null
    // !firebase.apps.length && await firebase.initializeApp(config.firebase)

    // if(!firebase.apps.length)
    //   return

    // const messaging = firebase.messaging()
    // messaging.onMessage(({ notification: { body, title } }) => {
    //   navigator.serviceWorker.ready.then(registration => {
    //     console.log({registration})
    //     registration.showNotification(title, body);
    //   });
    // })
    // console.log(messaging.getToken())
    // return window.Notification.requestPermission()
    //   .then(() => messaging.getToken())
    //   .catch(err => {console.log("APP_INFO", err); act('APP_INFO', err, 'warning')})
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
    query: `query { Staffs(where: { role: { _neq: "admin" } }) { id role name photo phoneNumber email } }`
  }).then(({ Staffs }) => Staffs),
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
  STATS_FETCH: () => [{}, [
    {
      label: 'assignments',
      total: 100,
      pedingNumber: 10,
      activatedNumber: 20,
      declinedNumber: 70
    },
    {
      label: 'consumers',
      total: 100,
      pendingNumber: 20,
      activatedNumber: 30,
      declinedNumber: 50,
    },
    {
      label: 'merchants',
      total: 100,
      pendingNumber: 90,
      activatedNumber: 8,
      declinedNumber: 2
    }
  ]],
  APP_INFO: async (data, type = 'error') => {
    const message = data && data?.message || data?.payload && data?.payload?.error || data
    // const info = { message: '', type }
    return store.set({ info: message, loading: false })
    // return store.set({ info, loading: false })
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

export default Act
