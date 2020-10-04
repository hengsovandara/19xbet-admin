import React from 'react'
import Link from 'next/link'
import { fucss } from 'next-fucss/utils'
import styled from "styled-components"

const Menu = ({ items, data, noBorder = false, children, titleStyle }) => {
  const index = items.findIndex(item => item.active)
  return (
    <div className={`w:100pc br:5px ${!noBorder && 'bd:1px-sd-e8e8e8' }`}>
      <MenuInner className={classNameMenuInner() + (titleStyle && titleStyle || '')}>
        {items.map((item, index) => {
          const value = item.amount && (data ? data[item.amount] : item.amount)
          if (item.disabled) {
            return null
          } else if (item.href) {
            return <Link key={index} href={item.href} scroll={false}>
              <a className={classNameMenu(item.active)}>
                {item.title}
                {!!value && <div className={classNameAmount(item.active)}>{value}</div>}
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
      </MenuInner>
      <>
        {items.some(item => item.component) && items.map(({ key, active, disabled, component: Component }) => {
          return active && !disabled && Component && (
            <div key={key}>{typeof Component === 'function' ? <Component /> : Component}</div>
          )
        })}
        {children && children[index] || children || null}
      </>
    </div>
  )
}

const classNameMenu = (active, amount) => fucss({
  'ta:l ps:rl bg:n ts:all tt:uc fw:bold p-t:16px p-b:12px dp:ib_ps:ab_b:0_h:4px_br:4px_bg:prim_span dp:flx ai:c m-rl:16px first-m-l:0 last-m-r:0 hv-c:prim hv-bg:prim_c:white_div ws:nowrap': true,
  'c:prim w:100pc_l:50pc_trx:50npc_span': active,
  'c:blacka8': !active
})

const MenuInner = styled.div`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const classNameMenuInner = active => fucss({
  'dp:flx ai:c of:hd of-x:auto fw:400 fs:18px': true,
})

const classNameAmount = active => fucss({
  'dp:flx ai,jc:c c:white fs:70pc nw:24px h:20px p-rl:4px p-t:1px m-l:5px br:4px ts:all fw:400': true,
  'bg:prim': active,
  'bg:black300': !active
})

export default Menu
