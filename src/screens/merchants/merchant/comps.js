import { Fragment, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { fucss } from 'next-fucss/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Particles from 'react-particles-js'
import Markdown from 'markdown-to-jsx'
import useActStore from 'actstore'
import { Tabs, BusinessInformation } from './elems'
import { actions } from './hooks'
import { setDate } from 'clik/libs'
import { Button, Scrollable, } from 'clik/elems/styles'
import Menu from 'clik/elems/menu'
import Documents from './documents'

const Information = dynamic(() => import('./information'))
const Shareholders = dynamic(() => import('./shareholders'))
const Directors = dynamic(() => import('./directors'))

export default ({ query: { id, step, open } }) => {
  const { act, store, action, handle, route } = useActStore(actions)
  const { socket, merchant = {}, user } = store.get('socket', 'merchant', 'user')
  const { activities = [], type, stats = {}, documents = [], businessTypeDocuments: examples = [] } = merchant || {}

  // const [assignmentId, setAssignmentId] = useState(merchant && merchant.assignmentId)
  const [business, setBusiness] = useState({})
  const [focus, setFocus] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [note, setNote] = useState('')

  const items = React.useMemo(() => {
    return [
      {
        title: 'Documents',
        key: 'documents',
        active: !step,
        href: { query: { id } },
        component: () => <Documents merchant={merchant} />,
      },
      {
        title: 'Information',
        key: 'information',
        active: step === 'information',
        href: { query: { id, step: 'information' } },
        component: () => <Information merchant={merchant} />,
      },
      {
        title: 'Shareholders',
        key: 'shareholders',
        active: step === 'shareholders',
        href: { query: { id, step: 'shareholders' } },
        component: () => <Shareholders open={open} merchant={merchant} />,
      },
      {
        title: 'Directors',
        key: 'directors',
        active: step === 'directors',
        href: { query: { id, step: 'directors' } },
        component: () => <Directors open={open} merchant={merchant} />,
      },
    ]
  }, [merchant, step, open])

  useEffect(() => {
    socket && id && act('MERCHANT_SUB', id)
    return action('MERCHANT_UNSUB')
  }, [id, socket])

  useEffect(() => {
    merchant && merchant.referenceId && act('GET_MERCHANT_BUSINESS', merchant.referenceId)
      .then(data => setBusiness(data))
  }, [merchant])

  const docsPercentage = merchant && merchant.documents && merchant.documents.length ? calcPercentage(merchant.documents) : 0

  if (!merchant) return null

  return (
    <Fragment>
      <Tabs tab="merchant" merchant={merchant} />
      <div className="md-dp:flx ai:fs md-p:24px">
        <div className={classNameWrap(toggle)}>
          <div className="ps:ab t,l:0 h:100pc w:100pc">
            <Particles
              className="h:100pc w:100pc op:0.5"
              params={{
                particles: {
                  number: { value: 20 },
                  size: {
                    value: 2,
                    anim: { speed: 0, size_min: 0.3 }
                  },
                  move: { random: true }
                }
              }}
            />
          </div>
          <div className={classNameLogWrap(toggle)}>
            <button onClick={() => setToggle(!toggle)} className="w,h,lh:40px mnw:40px ta:c c:white p:0 bd:2px-sd-fff br:50pc fs:.75em fw:700 bs:2 hv-try:1px ps:rl ts:all bg:6BC4BC">
              LOG<span className={classNameLogNot(toggle)}>{activities.length}</span>
            </button>
            {toggle && (
              <div className="ps:rl m-rl:16px w:100pc">
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    act('SEND_NOTE', merchant.id, user.id, note)
                  }}>
                  <input autoComplete="off" type="text" placeholder="Note" name="note" onChange={e => setNote(e.target.value)} value={note} onFocus={() => setFocus(true)} onBlur={() => setFocus()} className={classNameLogInput(focus)} />
                  <button type="submit" disabled={note === ''} className={classNameLogSendBtn(focus && note !== '')}>
                    <FontAwesomeIcon icon="paper-plane" />
                  </button>
                </form>
              </div>
            )}
            <button className="w,h,lh:40px mnw:40px ta:c c:white p:0-! bd:2px-sd-fff br:50pc bs:2 hv-try:1px ps:rl ts:all bg:6BC4BC">
              <FontAwesomeIcon icon="phone" />
            </button>
          </div>
          {toggle && (
            <Scrollable className="w:100pc mxh:600px of-y:scroll m-t:24px ps:rl">
              <div className="w:100pc c:black ta:c">
                {merchant.activities.map((log, index) => (
                  <div key={index} className={classNameRow(index % 2)}>
                    <Markdown className="ta:l fw:400 fs:85pc m-r:12px">{log.note || ''}</Markdown>
                    <div className="dp:flx jc:sb c:prim fs:75pc m-tb:12px p-t:12px">
                      <span>{log.owner ? log.owner.name : 'unidentified'}</span>
                      <span className="ta:r">{setDate(log.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Scrollable>
          )}
          <div className={classNameProfileImage(business?.logo || merchant?.logoUrl)} style={{ backgroundImage: `url(${business?.logo || merchant?.logoUrl})` }}>
            { !(business?.logo || merchant?.logoUrl) && <FontAwesomeIcon icon="store" size="2x" /> }
          </div>
          {/* {business && business.logo
            ? <div className={classNameProfileImage(business?.logo || merchant.logoUrl)} style={{ backgroundImage: `url(${business?.logo || merchant?.logoUrl})` }} />
            : <div className={classNameProfileImage()}><FontAwesomeIcon icon="store" size="2x" /></div>
          } */}
          {!toggle && (
            <div className="ps:rl dp:flx fd:col ai:c jc:sb flxw:wrap p:12px">
              <div className="w:100pc p-rl:16px ta:l dp:flx flxw:wrap jc:c">
                <BusinessInformation merchant={merchant} />
              </div>

              <div className="dp:flx fd:col m-tb:24px ps:rl">
                <Button className="w:100pc bg:white-! c:prim-!"
                  style={{
                    opacity: merchant.status === 'Verified' ? '0.5' : '1',
                    cursor: merchant.status === 'Verified' ? 'not-allowed' : 'pointer'
                  }}
                  disabled={merchant.status === 'Verified'}
                  onClick={() => act('VERIFY_MERCHANT', { status: 4, id })}
                >
                  {merchant.status === 'Verified' ? `Verified` : `Verify`}
                </Button>
                <Button outline className="w:100pc mnw:120px m-t:8px c:white-! hv-bd:1px-sd-f57167-!_bg:f57167-!"
                  style={{
                    opacity: merchant.status === 'Decline' ? '0.5' : '1',
                    cursor: merchant.status === 'Decline' ? 'not-allowed' : 'pointer'
                  }}
                  disabled={merchant.status === 'Decline'}
                  onClick={() => act('VERIFY_MERCHANT', { status: 8, id })}
                >
                  Invalid
                </Button>
              </div>


              <div className="w:100pc p-rl:16px dp:flx jc:fs ai:c ps:rl m-t:24px">
                <div>
                  <p className="fs:16px ta:l">Status</p>
                  <h3 className="dp:flx ai:c p:5px m-b:16px">
                    <span className={classNameStatus(merchant && merchant.status)} />
                    {merchant && merchant.status}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w:100pc md-w:68pc dp:flx fd:col m-b:24px c:sec">
          {/* <div className="dp:flx jc:sb flxw:wrap lg-flxw:nowrap w:100pc br:5px bg:white ta:l p:24px m-b:12px bd:1px-sd-e8e8e8 fw:500">
            <div className="p-r:12px m-b:12px lg-m-b:0">
              <p className="m-b:5px fs:85pc">Business Type</p>
              <h3 className="fw:600">{merchant?.business?.name}</h3>
            </div>
            <div className="p-r:12px m-b:12px lg-m-b:0">
              <p className="m-b:5px fs:85pc">Uploaded Documents</p>
              <h3 className="fw:600">
                {stats.provided} / {stats.required}
              </h3>
            </div>
            <div className="flxb:100pc lg-flxb:33.33pc lg-mxw:200px">
              <p className="m-b:5px fs:85pc">Progress</p>
              <div className="w:100pc p:2px ps:rl bg:prima3 br:5px lh:1">
                <span style={{ width: `${docsPercentage}%` }} className="bg:prim mnw:15pc h:24px p-t:1px br:4px jc:c c:white fw:600 dp:flx ai:c m:0">
                  {docsPercentage + '%'}
                </span>
              </div>
            </div>
          </div> */}

          <Menu items={items} />

        </div>
      </div>
    </Fragment>
  )
}

const classNameWrap = active =>
  fucss({
    'w:100pc md-w:30pc mnw:250px br:5px m-b:24px ps:rl md-od:2 md-m-l:2pc bd:1px-sd-prim': true,
    'bg:white p:16px': active,
    'bg:6BC4BC': !active
  })

const classNameRow = isEven =>
  fucss({
    'ta:l p:16px-12px mnh:60px': true,
    'bg:F8F9FC bd-t:1px-sd-f0f0f0_div': isEven,
    'bd-t:1px-sd-f5f5f5_div': !isEven
  })

const classNameStatus = status =>
  fucss({
    'dp:ib w,h:18px bd:2px-sd-white m-r:12px br:50pc': true,
    'bg:white': status === 'Created',
    'bg:orange': status === 'Pending',
    'bg:00d061': status === 'Verified',
    'bg:prim': status === 'Active',
    'bg:red': status === 'Decline',
    'bg:black': status === 'Disabled',
  })

const classNameLogWrap = active =>
  fucss({
    'dp:flx jc:sb ai:c w:100pc ps:rl p:16px br:5px-12px-0-0': true,
    'bg:white p:0 m-b:24px': active,
    'bg:none': !active
  })

const classNameLogNot = active =>
  fucss({
    'ps:ab b:100pc l:100pc m-bl:10npx bg:red c:white lh:1 br:5px p:5px fs:.8em': true,
    'dp:none': active,
    'dp:ib': !active
  })

const classNameLogInput = isFocused =>
  fucss({
    'bd-b:1px-sd-ccc w:100pc p-r:25px p-tb:5px': true,
    'bd-c:prim c:prim': isFocused
  })

const classNameLogSendBtn = isFocused =>
  fucss({
    'bg:none ps:ab r:0 t:0 fs:14px p:5px': true,
    'c:grey200': !isFocused,
    'c:prim ': isFocused
  })

const classNameProfileImage = (logo) => fucss({
  'ps:rl br:50pc m-t:12px m-b:24px w,h:100px': true,
  'bd:1px-sd-prim bg:white bg-sz:cv-! bg-ps:c m-rl:auto': logo,
  'bd:2px-sd-white bg:6BC4BC m-rl:auto c:white dp:flx jc:c ai:c': !logo
})

const calcPercentage = (docs) => {
  let validDocs = []

  docs.map(i => {
    if (i.isValid) validDocs.push(i)
  })

  // The Set object lets you store unique values of any type, whether primitive values or object references.
  let types = [...new Set(validDocs.map(i => i.name))]

  switch (types.length) {
    case 1:
      return 33
    case 2:
      return 66
    case 3:
      return 100
    default:
      return 0
  }
}

``