import { useEffect } from 'react'

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof document !== 'object') return
    if ('serviceWorker' in window.navigator)
      window.navigator.serviceWorker.register('/fbSw.js')
        .then(
          ({ scope }) => console.log('ServiceWorker registered ', scope),
          err => console.log('ServiceWorker failed: ', err)
        )
  }, [])
}

export const ServiceWorker = () => {
  useServiceWorker()
  return null
}

export default useServiceWorker