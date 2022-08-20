const HASURA_URL = process.env.HASURA_URL || '165.22.61.154:8080'
const NODE_API = process.env.NODE_API || 'http://165.22.61.154:8081/api'

export const GQL_URL = 'http://' + HASURA_URL + '/v1alpha1/graphql'
export const WSS_URL = 'ws://' + HASURA_URL + '/v1alpha1/graphql'

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

export const firebase = {
  apiKey: "AIzaSyC3HRDZqta_5vIl3eprwtlisaoB5F4wrTQ",
  authDomain: "xbet-client.firebaseapp.com",
  projectId: "xbet-client",
  storageBucket: "xbet-client.appspot.com",
  messagingSenderId: "178374313428",
  appId: "1:178374313428:web:1dd13535fea68964714241",
  measurementId: "G-JJXKCWN0PW"
}

export function getRoutes() {
  return {
    index: { link: '/', title: 'Dashboard', icon: 'home' },
    // management: { link: '/management', title: 'ការគ្រប់គ្រង', icon: 'tasks' },
    // consumers: { link: '/consumers', title: 'គ្រប់គ្រងអតិថិជន', icon: 'user-friends', roles: ['admin', 'manager'] },
    staff: { link: '/staff', title: 'គ្រប់គ្រងបុគ្គលិក', icon: 'users', roles: ['admin', 'manager'] },
    website: { link: '/website', title: 'គេហទំព័រ', icon: 'futbol', roles: ['admin', 'manager'] },
    promotions: { link: '/promotions', title: 'ប្រម៉ូសិន', icon: 'ad', roles: ['admin', 'manager'] },
    news: { link: '/news', title: 'ព័តមាន', icon: 'futbol', roles: ['admin', 'manager'] },
    // reports: { link: '/reports', title: 'របាយការណ៍', icon: 'file-invoice-dollar', roles: ['admin'] },
    login: { link: '/login', title: 'Sign In', hide: true }
  }
}

export default {
  ENV: process.env,
  HASURA_URL,
  NODE_API,
  GQL_URL,
  WSS_URL,
  endpoints,
  getRoutes,
  firebase
}
