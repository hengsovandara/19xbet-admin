const HASURA_URL = process.env.HASURA_URL || '247khmer.com'
const NODE_API = process.env.NODE_API || 'http://127.0.0.1:8080/api'

export const GQL_URL = 'https://' + HASURA_URL + '/v1alpha1/graphql'
export const WSS_URL = 'wss://' + HASURA_URL + '/v1alpha1/graphql'
export const GQL_MUTATION_URL = NODE_API + '/validation'

export const LIVENESS_AI = 'https://liveliness201.clik.asia'

// ENDPOINTS
export const endpoints = {
  areas: NODE_API + '/areas/',
  countries: NODE_API + '/countries',
  ekyc: NODE_API + '/ekyc',
  ekym: NODE_API + '/ekym',
  upload: NODE_API + '/upload',
  business: NODE_API + '/business',
  login: NODE_API + '/auth/login',
  qr: NODE_API + '/qr',
  session: NODE_API + '/session',
  enums: NODE_API + '/enums',
  validations: NODE_API + '/validations',
  image: NODE_API + '/image?path=',
  userUpdate: NODE_API + '/users/update',
  users: NODE_API + '/users',
  userReset: NODE_API + '/users/reset',
}

export function getRoutes() {
  return {
    index: { link: '/', title: 'Dashboard', icon: 'home' },
    management: { link: '/management', title: 'របាយការណ៍', icon: 'tasks' },
    consumers: { link: '/consumers', title: 'គ្រប់គ្រងអតិថិជន', icon: 'shopping-basket', roles: ['admin', 'manager'] },
    staff: { link: '/staff', title: 'គ្រប់គ្រងបុគ្គលិក', icon: 'users', roles: ['admin'] },
    login: { link: '/login', title: 'Sign In', hide: true }
  }
}

export default {
  ENV: process.env,
  HASURA_URL,
  NODE_API,
  LIVENESS_AI,
  GQL_URL,
  WSS_URL,
  GQL_MUTATION_URL,
  endpoints,
  getRoutes
}
