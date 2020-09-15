import React from 'react'
import { fucss } from 'next-fucss/utils'

const Logo = ({ source, corporation }) => {
  var src, alt

  switch (source) {
    case 'slash':
      src = '/static/imgs/slash.png'
      alt = 'Slash'
      break
    case 'merchant':
      src = '/static/imgs/logo-white.png'
      alt = 'Merchant'
      break
    case 'other':
      src = corporation && corporation.logo
      alt = corporation && corporation.name
      break
    default:
      src = '/static/imgs/clik-logo.png'
      alt = 'Consumer'
      break
  }

  return (
    <div>
      <img src={src} alt={alt} width="24" height="24" className={fucss({ 'bg:black300 br:5px va:m': source === 'merchant' })} />
    </div>
  )
}

export default Logo
