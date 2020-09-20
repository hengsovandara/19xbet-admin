import React from 'react'
import useActStore from 'actstore'
import Address from './address'
import Log from './Log'
import Automation from './automation'
import Details from './details'
import actions from './actions'
import Menu from '../../../@clik/elems/menu'
import Invalid from '../../../@clik/elems/invalid'
import { fucss } from 'next-fucss/utils'
import Button from '../../../@clik/elems/button'
import Router from 'next/router'
import Icon from '../../../@clik/elems/icon'

export default ({ query }) => {
  const { id, step } = query
  const { act, store, action } = useActStore(actions, [])
  const { corporation, enums: { reasons, fields }, user } = store.get('corporation', 'enums', 'user')
  const [consumer, setConsumer] = React.useState()
  const [validations, setValidations] = React.useState([])
  const [popup, setPopup] = React.useState()
  const [data, setData] = React.useState([])
  const [toggled, setToggled] = React.useState()

  React.useEffect(() => { act('CONSUMER_FETCH', id).then(data => {
    setData(data)
    setConsumer(data[0])
    setValidations(generateValidations(data, corporation.rules, user, fields))
  }) }, [])

  const onPress = (status, item) => setPopup({ status, item,
    onSubmit: ({ note, value }) => {
      const validation = validations.find(validation => item.field === validation.field)
      const recordValidation = data[1].find(validation => item.field === validation.field)

      if(validation)
        setValidations(validations.map(valid =>
          item.field === valid.field
            ? { ...valid, note, reason: value, userId: null, status, previousValue: (!!valid.createdAt && status === 'accepted') ? recordValidation.value : '', value: status !== 'accepted' ? '' : item.value }
            : valid
        ))
      else {
        const newValidation =  { note, reason: value, userId: null, status, value: '', ...item }
        setValidations(validations.concat(newValidation))
      }
    }
  })

  const items = React.useMemo(() => {
    return [
      {
        title: 'Identity Verification',
        key: 'automation',
        active: (!step || step === 'automation'),
        href: { query: { ...query, id, step: 'automation' } }
      },
      {
        title: 'Personal Information',
        key: 'details',
        active: step === 'details',
        href: { query: { ...query, id, step: 'details' } }
      },
      {
        title: 'Current Address',
        key: 'address',
        active: step === 'address',
        disabled: !consumer?.address?.city,
        href: { query: { ...query, id, step: 'address' } }
      }
    ]
  }, [consumer, step, query])

  if (!consumer) return null

  return (
    <React.Fragment>
      <div className="w:100pc m:auto">
        <div className="dp:flx ai:fs flxw:wrap w:100pc h:100pc p:24px">
          <div className={classNameProfile(toggled)}>
            <div className={classNameProfileToggle(toggled)} onClick={() => setToggled(!toggled)}>
              <Icon icon="ellipsis-v" />
            </div>
            <div className="h:100pc dp:flx flxd:col p:12px-24px-0 of:auto">
              <Tabs consumer={consumer} upload={action('CONSUMER_UPLOAD')} />
              <Log
                onSubmit={() => act('CONSUMER_INSERT_VALIDATIONS', { consumerId: consumer.id, userId: user.id, validations})}
                onReject={() => setPopup({ status: 'rejected', onSubmit: ({ note, value }) => act('CONSUMER_INSERT_VALIDATIONS', { consumerId: consumer.id, userId: user.id, validations }, note) }) }
                onBack={() => handleBack()}
                query={query}
                user={user}
                {...consumer}
                validations={validations}
                logs={data[1]}
                notes={data[2]}
                photoUrl={consumer?.face?.imageUrl}
                amazonS3FaceVideo={consumer?.face?.url}
                identityDocumentUrl={consumer?.identity?.url}
              />
            </div>
          </div>

          <div className="bg:white w:100pc br:8px xl-w:calc(100pc-450px)">
            <Menu noBorder items={items}>
              {[
                <Automation
                  validations={validations}
                  onPress={onPress}
                  consumer={consumer}
                  user={user} />,
                <Details
                  validations={validations}
                  onPress={onPress}
                  consumer={consumer}
                  user={user} />,
                <Address
                  validations={validations}
                  onPress={onPress}
                  consumer={consumer}
                  user={user} />
              ]}
            </Menu>
          </div>
        </div>

        {popup && <Invalid
          {...consumer}
          popup={popup}
          onSubmit={popup.onSubmit}
          onClose={() => setPopup(false)}
          {...getReasons(reasons, popup.status || 'requested', popup.item, consumer)}
        />}
      </div>
    </React.Fragment>
  )
}

const classNameProfile = (toggled) => fucss({
  'smx-w:280px w:320px xl-w:450px bg:f3f3f3 bd-l:1px-sd-blacka12 ps:fx b:0 t:70px z:2 ts:all': true,
  'r:0': toggled,
  'smx-r:280npx r:320npx xl-r:0': !toggled
})

const classNameProfileToggle = (toggled) => fucss({
  'h:40px w:30px br:4px-0-0-4px bg:prim ps:ab t:50pc try:50npc l:30npx dp:flx ai,jc:c c:white crs:pt fs:16px xl-dp:n': true,
  'r:0': toggled,
  'r:360npx xl-r:0': !toggled
})

function Tabs({ consumer, upload }) {

  return (
    <div className="dp:flx flxw:wrap xl-flxw:nowrap ai:c m-b:16px m-rl:8npx">
      <div className="flxg:1 m:8px">
        <Button disabled={true} full name="selfie" text="Selfie" icon="camera" type="file" data={consumer} action={upload} />
      </div>
      <div className="flxg:1 m:8px">
        <Button disabled={true} full name="document" text="Photo ID" icon="id-card" type="file" data={consumer} action={upload} />
      </div>
      <div className="flxg:1 m:8px">
        <Button disabled={true} full icon="phone" text="Call" />
      </div>
    </div>
  )
}

function handleBack(){
  Router.push('/management')
}

function generateValidations([consumer, validations], rules, user, fields){
  const risks = ['success', 'warning', 'danger']
  const types = ['accepted', 'requested', 'escalated']
  const screenings = consumer?.screening?.matches || 0

  return fields.filter(item => item && !!(item.enable ? consumer[item.enable] : (item.path ? consumer[item.path][item.field] : consumer[item.field]))).map(item => {
    const validation = validations.find(valid => valid.field === item.field) || {}
    const brackets = rules[item.key] || []
    const value = validation.value || item.path ? consumer[item.path] && consumer[item.path][item.field] : consumer[item.field] || 0
    let index = brackets.findIndex(rule => brackets[0] < brackets[1] ? rule >= Number(value) : rule <= Number(value))
    const matches = [ ...new Set([consumer.ocr[item.field], consumer.mrz[item.field], value].filter(val => !!val).map(val => String(val).toLowerCase()))]
    index = (index === undefined || index < 0) ? matches.length === 1 ? 0 : 2 : index
    if(item.field === 'screening' && consumer?.screening?.types){
      const tags = consumer?.screening?.types?.length
      index = tags > 2 ? 2 : tags
    }

    let status = (!index ? types[index] : null) || (item.field === 'screening' ? screenings > 0 ? 'escalated' : 'accepted' : null)
    const risk = risks[index]
    status = validation.status || status

    const valid = {
      ...item,
      ...validation,
      disabled: ['associate'].includes(user.role) && index > 0 && !status,
      risk,
      status,
      value: (status === 'accepted' && validation.value) || (matches.length === 1 && status === 'accepted' && value) || null,
      history: (validations || []).filter(valid => valid?.field === item.field)
    }
    return valid
  })
}

const getReasons = (reasons, type, item = {}, consumer) => {

  const object = {
    requested: {
      title: 'Request additional information',
      subtitle: 'Send request for'
    },
    escalated: {
      title: 'Escalate application',
      subtitle: 'Reason'
    },
    accepted: {
      title: 'Accept information',
      subtitle: 'Justification',
    },
    rejected: {
      title: 'Reject application'
    }
  }

  const filter = {
    document: !!Object.keys(consumer.document).length
  }

  return {
    ...object[type],
    options: reasons.filter(reason => reason.type === type && (!reason.fields.length || reason.fields.includes(item.field)))
      .filter(({ filter: { enabled, disabled } }) => !enabled && !disabled || (enabled && !!filter[enabled]) || (disabled && !filter[disabled]))
  }
}
