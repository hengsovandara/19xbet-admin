import React from 'react'
import Link from 'next/link'
import { fucss } from 'next-fucss/utils'

const Menu = ({ items }) => {
  return (
    <div className="w:100pc br:5px bd:1px-sd-e8e8e8">
      <div className="w:100pc dp:flx ai:c bd-b:1px-sd-e8e8e8">
        {items.map((item, index) => {
          if (item.disabled) {
            return null
          } else if (item.href) {
            return <Link key={index} href={item.href}>
              <a className={classNameMenu(item.active)}>
                {item.title}
                <span />
              </a>
            </Link>
          } else {
            return <a key={index} className={classNameMenu(item.active)}>
              {item.title}
              <span />
            </a>
          }
        })}
      </div>
      <div>
        {items.map(({ title, key, active, disabled, component: Component }) => {
          if (active && !disabled) {
            return (
              <div key={key}>
                <Component />
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

const classNameMenu = active => fucss({
  'ps:rl bg:n p:20px-15px ts:all tt:uc fw:bold dp:ib_ps:ab_b:3npx_h:5px_br:5px_bg:prim_span dp:flx ai:c': true,
  'c:prim400 w:70pc_l:50pc_trx:50npc_span': active,
  'c:grey300': !active
})

export default Menu
