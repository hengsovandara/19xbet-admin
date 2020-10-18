import { useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/messaging'

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof document !== 'object') return
    if ('serviceWorker' in window.navigator){
      console.log('sw registered')
      // window.SW = window.navigator.serviceWorker.register('../sw.js')
      //   .then((registration) => {
      //     registerMessaging(registration)
      //     return registration
      //   })
    }
  }, [])
}

const registerMessaging = async (registration) => {
  const messaging = firebase.messaging()
  messaging.useServiceWorker(registration)
  console.log({messaging: messaging.getToken()})
}

export const ServiceWorker = () => {
  useServiceWorker()
  return null
}

export default useServiceWorker