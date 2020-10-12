import { useEffect } from 'react'
import 'firebase/messaging'

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof document !== 'object') return
    if ('serviceWorker' in window.navigator){
      console.log('sw registered')
      window.SW = window.navigator.serviceWorker.register('../sw.js')
        .then((registration) => {console.log({registration}); return registration})
    }
  }, [])
}

export const ServiceWorker = () => {
  useServiceWorker()
  return null
}

export default useServiceWorker