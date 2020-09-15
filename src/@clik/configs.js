const CFG = typeof window === 'object' ? window.__NEXT_DATA__.runtimeConfig : process.env
export const ENV = CFG.env

const HASURA_URL = CFG.HASURA_URL || 'node-test.clik.asia/hasura-ekmc'
const EKYC_NODE_URL = CFG.EKYC_NODE_URL || 'https://node-test.clik.asia/ekmc'

export const CLIK_URL = CFG.CLIK_URL || 'https://api-stage.clik.asia'
export const MAP_KEY = CFG.MAP_KEY || 'AIzaSyAgMC8LbElyRwRNqeabZKNhugSXO-W6Z1I'

export const GQL_URL = ENV === 'dev' ? 'http://' + HASURA_URL + '/v1alpha1/graphql' : 'https://' + HASURA_URL + '/v1alpha1/graphql'
export const WSS_URL = ENV === 'dev' ? 'ws://' + HASURA_URL + '/v1alpha1/graphql' : 'wss://' + HASURA_URL + '/v1alpha1/graphql'
export const GQL_MUTATION_URL = EKYC_NODE_URL + '/validation'

// ENDPOINTS
export const endpoints = {
  areas: EKYC_NODE_URL + '/areas/',
  ekyc: EKYC_NODE_URL + '/ekyc',
  ekym: EKYC_NODE_URL + '/ekym',
  upload: EKYC_NODE_URL + '/upload',
  business: EKYC_NODE_URL + '/business',
  login: EKYC_NODE_URL + '/login',
  qr: EKYC_NODE_URL + '/qr',
  session: EKYC_NODE_URL + '/session',
  enums: EKYC_NODE_URL + '/enums'
}

export function getRoutes() {
  return {
    index: { link: '/', title: 'Dashboard', icon: 'home' },
    consumers: { link: '/consumers', title: 'Consumers', icon: 'shopping-basket' },
    merchants: { link: '/merchants', title: 'Merchants', icon: 'store' },
    login: { link: '/login', title: 'Sign In', hide: true }
  }
}

export const S3config = {
  bucketName: 'web-clik-staging-files',
  // dirName: 'photos', /* optional */
  region: 'ap-southeast-1',
  accessKeyId: 'AKIAJ4HP3T7VO2KOYAPQ',
  secretAccessKey: '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'
}

export default {
  ENV,
  HASURA_URL,
  EKYC_NODE_URL,
  CLIK_URL,
  MAP_KEY,
  GQL_URL,
  WSS_URL,
  GQL_MUTATION_URL,
  endpoints,
  getRoutes,
  S3config
}
