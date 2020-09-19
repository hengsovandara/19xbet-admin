const CFG = typeof window === 'object' ? window.__NEXT_DATA__.runtimeConfig : process.env
export const ENV = CFG.env

const HASURA_URL = CFG.HASURA_URL || '247khmer.com'
const API_URL = CFG.API_URL || 'http://192.168.0.51:8080/api'

export const GQL_URL = ENV === 'dev' ? 'http://' + HASURA_URL + '/v1alpha1/graphql' : 'https://' + HASURA_URL + '/v1alpha1/graphql'
export const WSS_URL = ENV === 'dev' ? 'ws://' + HASURA_URL + '/v1alpha1/graphql' : 'wss://' + HASURA_URL + '/v1alpha1/graphql'

// ENDPOINTS
export const endpoints = {
  areas: API_URL + '/areas/',
  ekyc: API_URL + '/ekyc',
  ekym: API_URL + '/ekym',
  upload: API_URL + '/upload',
  business: API_URL + '/business',
  login: API_URL + '/auth/login',
  qr: API_URL + '/qr',
  session: API_URL + '/session',
  enums: API_URL + '/enums'
}

export function getRoutes() {
  return {
    index: { link: '/', title: 'Dashboard', icon: 'home' },
    consumers: { link: '/consumers', title: 'Consumers', icon: 'shopping-basket' },
    // merchants: { link: '/merchants', title: 'Merchants', icon: 'store' },
    login: { link: '/login', title: 'Sign In', hide: true }
  }
}

export const S3config = {
  bucketName: 'web-clik-staging-files',
  region: 'ap-southeast-1',
  accessKeyId: 'AKIAJ4HP3T7VO2KOYAPQ',
  secretAccessKey: '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'
}

export default {
  ENV,
  HASURA_URL,
  API_URL,
  GQL_URL,
  WSS_URL,
  endpoints,
  getRoutes,
  S3config
}
