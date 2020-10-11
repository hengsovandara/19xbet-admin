import { useEffect } from 'react'
import  'firebase/messaging';

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof document !== 'object') return
    if ('serviceWorker' in window.navigator){
      window.SW = window.navigator.serviceWorker.register('../firebase-messaging-sw.js')
        .then((registration) => registration)
    }
  }, [])
}

export const ServiceWorker = () => {
  useServiceWorker()
  return null
}

export default useServiceWorker