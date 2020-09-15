import Router from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

function Tabs({ tab, consumer }) {
  const { id, referenceId } = consumer || {}

  const tabs = [
    { label: 'Tab1', value: 'Consumer', active: !tab, href: { query: { id } } },
    { label: 'Tab2', value: 'Merchant', active: tab === 'merchant', href: { query: { id, tab: 'merchant' } } }
  ]

  return (
    <div className="p:0-0-20px md-p:0-20px-20px">
      <div className="dp:flx jc:sb bd-b:1px-sd-e8e8e8 c:black">
        <div className="dp:flx jc:fs">
          <button className="bg:n c:prim tt:uc fw:700 fs:110pc p-r:5px" onClick={() => Router.back()}>
            <FontAwesomeIcon icon="angle-left" />
          </button>
          {tabs.map((tab, index) => {
            return tab.href ? (
              <Link key={index} href={tab.href}>
                <a className={classNameTab(tab.active)}>
                  {tab.value}
                  <span></span>
                </a>
              </Link>
            ) : (
                <Link key={index}>
                  <a className={classNameTab(tab.active)}>
                    {tab.value}
                    <span></span>
                  </a>
                </Link>
              )
          })}
        </div>
        <p className="dp:n md-dp:ib p:12px-15px ta:c c:prim300 fs:90pc fw:800 consumer-id">ID: {id || 'N/A'}</p>
      </div>
    </div>
  )
}

export default Tabs

const classNameTab = active =>
  fucss({
    'ps:rl bg:n p:12px-15px ts:all c:grey200 tt:uc dp:ib_ps:ab_b:3npx_h:5px_br:5px_bg:prim_span dp:flx ai:c': true,
    'c:prim400 fw:700 w:50pc_l:50pc_trx:50npc_span': active,
    'w:0_l:0_m-l:0_span dp:n': !active
  })
