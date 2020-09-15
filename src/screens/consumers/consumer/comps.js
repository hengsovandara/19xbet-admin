import { useEffect, useState, Fragment } from 'react'
import useActStore from 'actstore'
import { Log, Tab, Appearance, Form, Extra, Ocr } from '.'
import { actions } from './hooks'
import Menu from '../../../@clik/elems/menu'
import Invalid from '../../../@clik/elems/invalid'

import { UPDATE_ACCOUNT, LOCK_ACCOUNT } from '../../../@clik/data'

export default ({ query }) => {
  const { id, step } = query
  const { act, store, action } = useActStore(actions)
  const { socket, consumer } = store.get('socket', 'consumer')
  const { city, district, corporation } = consumer || {}
  const [areas, setAreas] = useState()
  const [isLocked, setIsLocked] = useState()
  const [isUpdated, setIsUpdated] = useState()
  const [invalid, setInvalid] = useState()

  // console.log(consumer)

  useEffect(() => {
    socket && id && act('CONSUMER_SUB', id)
    return action('CONSUMER_UNSUB')
  }, [id, socket])

  useEffect(() => {
    act('APP_AREAS_FETCH', consumer).then(setAreas)
  }, [city, district])

  useEffect(() => {
    if (!consumer) return
    const { assignmentId } = consumer || {}
    !assignmentId && act('CONSUMER_ASSIGN', { verificationId: id })
    return () =>
      assignmentId &&
      act('CONSUMER_UNASSIGN', { verificationId: id, assignmentId })
  }, [
    (consumer && consumer.assignmentId) || (consumer && !consumer.assignmentId)
  ])

  let tab
  const items = React.useMemo(() => {
    return [
      {
        title: 'Step1',
        key: 'step1',
        active: !step,
        href: { query: { id } },
        component: () => <Appearance {...consumer} nextStep={items} handleResolve={action('CONSUMER_UPDATE')} />
      },
      {
        title: 'Step2',
        key: 'OCR-MRZ',
        active: step === 'ocr-mrz',
        href: { query: { id, step: 'ocr-mrz' } },
        component: () => <Form consumer={consumer} nextStep={items} areas={areas} handleChange={action('CONSUMER_UPDATE')} />
      },
      {
        title: 'Extra',
        key: 'Extra Information',
        active: step === 'extra',
        disabled: corporation && corporation.name === 'Clik bank',
        href: { query: { id, step: 'extra' } },
        component: () => consumer.corporation && consumer.corporation.name !== 'Clik bank' && step === 'extra' &&
          <Extra consumer={consumer} nextStep={items} handleChange={action('CONSUMER_UPDATE')} />
      }
    ]
  }, [consumer, step, query])

  if (!consumer) return null

  return (
    <Fragment>
      <div className="mxw:1200px">
        <Tab tab={tab} consumer={consumer} />
        {!tab && (
          <div className="dp:flx ai:fs flxw:wrap w:100pc md-p:20px">
            <Log
              {...consumer}
              data={consumer}
              photoUrl={consumer.photoUrl || consumer.amazonS3FaceImage}
              identityDocumentUrl={
                consumer.identityDocumentUrl || consumer.amazonS3IdDocument
              }
              setIsUpdated={setIsUpdated}
              setInvalid={setInvalid}
              setIsLocked={setIsLocked}
              update={action('CONSUMER_UPDATE')}
              upload={action('CONSUMER_UPLOAD')}
            />

            <div className="bg:white w:100pc md-w:60pc md-od:1 of:hd">
              <Menu items={items} />
            </div>
          </div>
        )}

        {isUpdated && (
          <Invalid
            {...consumer}
            isLocked={isLocked}
            openPopup={setIsUpdated}
            options={UPDATE_ACCOUNT}
            update={action('CONSUMER_UPDATE')}
          />
        )}

        {invalid && (
          <Invalid
            {...consumer}
            isLocked={isLocked}
            openPopup={setInvalid}
            options={LOCK_ACCOUNT}
            update={action('CONSUMER_UPDATE')}
          />
        )}
      </div>
    </Fragment>
  )
}
