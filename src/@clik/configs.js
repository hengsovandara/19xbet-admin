const HASURA_URL = process.env.HASURA_URL || 'node-test.clik.asia/hasura-ekmc'
const EKYC_NODE_URL = process.env.EKYC_NODE_URL || 'https://node-test.clik.asia/ekmc'

export const GQL_URL = 'https://' + HASURA_URL + '/v1alpha1/graphql'
export const WSS_URL = 'wss://' + HASURA_URL + '/v1alpha1/graphql'
export const GQL_MUTATION_URL = EKYC_NODE_URL + '/validation'

export const LIVENESS_AI = 'https://liveliness201.clik.asia'

// ENDPOINTS
export const endpoints = {
  areas: EKYC_NODE_URL + '/areas/',
  countries: EKYC_NODE_URL + '/countries',
  ekyc: EKYC_NODE_URL + '/ekyc',
  ekym: EKYC_NODE_URL + '/ekym',
  upload: EKYC_NODE_URL + '/upload',
  business: EKYC_NODE_URL + '/business',
  login: EKYC_NODE_URL + '/login',
  qr: EKYC_NODE_URL + '/qr',
  session: EKYC_NODE_URL + '/session',
  enums: EKYC_NODE_URL + '/enums',
  validations: EKYC_NODE_URL + '/validations',
  image: EKYC_NODE_URL + '/image?path=',
  userUpdate: EKYC_NODE_URL + '/users/update',
  users: EKYC_NODE_URL + '/users',
  userReset: EKYC_NODE_URL + '/users/reset',
}

export function getRoutes() {
  return {
    index: { link: '/', title: 'Dashboard', icon: 'home' },
    // accounts: { link: '/accounts', title: 'Accounts', icon: 'users', roles: ['admin'] },
    // alt: { link: '/alt', title: 'Alt', icon: 'home' },
    management: { link: '/management', title: 'Management', icon: 'tasks' },
    consumers: { link: '/consumers', title: 'Consumers', icon: 'shopping-basket', roles: ['admin', 'manager'] },
    staff: { link: '/staff', title: 'Staff Managment', icon: 'users', roles: ['admin'] },
    merchants: { link: '/merchants', title: 'Merchants', icon: 'store', roles: ['admin'] },
    'AI / ML': { link: '/learning', title: 'AI/ML', icon: 'brain', roles: ['admin'] },
    login: { link: '/login', title: 'Sign In', hide: true }
  }
}

export default {
  ENV: process.env,
  HASURA_URL,
  EKYC_NODE_URL,
  LIVENESS_AI,
  GQL_URL,
  WSS_URL,
  GQL_MUTATION_URL,
  endpoints,
  getRoutes
}
