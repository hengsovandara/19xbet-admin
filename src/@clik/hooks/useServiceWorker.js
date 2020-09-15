import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    if (typeof document !== 'object') return
    if ('serviceWorker' in window.navigator)
      window.navigator.serviceWorker
        .register('/sw.js')
        .then(
          ({ scope }) => console.log('ServiceWorker registered ', scope),
          err => console.log('ServiceWorker failed: ', err)
        )
  }, [])
}
