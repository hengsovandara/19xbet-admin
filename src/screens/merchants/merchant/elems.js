import { Fragment, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import Link from 'next/link'
import Router from 'next/router'
import { toCapitalize } from '../../../@clik/libs'

export const Tabs = ({ tab, merchant }) => {
  const tabs = [
    { label: 'Tab1', value: 'Consumer', active: !tab, href: { query: { id: merchant && merchant.id } } },
    { label: 'Tab2', value: 'Merchant', active: tab === 'merchant', href: { query: { id: merchant && merchant.id, tab: 'merchant' } } }
  ]

  return (
    <div className="p:0-0-24px md-p:0-24px-24px">
      <div className="dp:flx jc:sb bd-b:1px-sd-e8e8e8 c:black">
        <div className="dp:flx jc:fs bd-b:1px-sd-e8e8e8 c:black">
          <button className="bg:n c:prim tt:uc fw:700 fs:110pc p-r:5px" onClick={() => Router.push('/merchants')}>
            <FontAwesomeIcon icon="angle-left" />
          </button>
          {tabs.map((tab, index) => {
            return tab.href ? (
              <Link key={index} href={tab.href}>
                <a className={classNameTab(tab.active)}>
                  {tab.value}
                  <span />
                </a>
              </Link>
            ) : (
                <Link key={index}>
                  <a className={classNameTab(tab.active)}>
                    {tab.value}
                    <span />
                  </a>
                </Link>
              )
          })}
        </div>
        <p className="dp:n md-dp:ib p:12px-16px ta:c c:prim300 fs:90pc fw:800 consumer-id">ID: {merchant.referenceId || merchant.id || 'N/A'}</p>
      </div>
    </div>
  )
}

export const BusinessInformation = ({merchant}) => {
  const { name, business={}, companyName, incorporationDate, incorporationCountry, registrationNumber, businessActivities } = merchant
  return <Fragment>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Type</label>
      <p className={classNameSubTitle()}>{business?.name || ''}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Name</label>
      <p className={classNameSubTitle()}>{companyName || name || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Date of Incorporation</label>
      <p className={classNameSubTitle()}>{incorporationDate || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Country of Incorporation</label>
      <p className={classNameSubTitle()}>{incorporationCountry || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Registeration Number</label>
      <p className={classNameSubTitle()}>{registrationNumber || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Activities</label>
      <p className={classNameSubTitle()}>{businessActivities || 'N/A'}</p>
    </div>
    {/* <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Size</label>
      <p className={classNameSubTitle()}>{toCapitalize(size) || 'N/A'}</p>
    </div> */}
    {/* <div className={classNameGroup()}>
      <label className={classNameTitle()}>Address</label>
      <p className={classNameSubTitle()}>{address.addressString || 'N/A'}</p>
    </div> */}
    {/* <div className={classNameGroup()}>
      <label className={classNameTitle()}>Description</label>
      <p className={classNameSubTitle()}>{description}</p>
    </div> */}
  </Fragment>
}

const classNameGroup = () => fucss({ 'w:100pc m-b:25px': true })
const classNameTitle = () => fucss({ 'c:f5f5f5 m-b:5px': true })
const classNameSubTitle = borderBottom => fucss({
  'c:white fw:600 fs:115pc': true,
  'bd-b:2px-sd-white': borderBottom
})

const classNameTab = active =>
  fucss({
    'ps:rl bg:n p:12px-16px ts:all c:grey200 tt:uc dp:ib_ps:ab_b:3npx_h:5px_br:5px_bg:prim_span dp:flx ai:c': true,
    'c:prim400 fw:700 w:50pc_l:50pc_trx:50npc_span': active,
    'w:0_l:0_m-l:0_span dp:n': !active
  })


