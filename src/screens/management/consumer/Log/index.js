import { useState, useEffect, useRef, Fragment } from 'react'
import { fucss } from 'next-fucss/utils'
import Button from 'clik/elems/button'
import { useRouter } from 'next/router'
import { classNameImage } from './elems'
import Menu from 'clik/elems/menu'
import ZoomedImage from 'clik/elems/zoomedImage'
import { setDate } from 'clik/libs'
import { ElemPopup } from 'clik/comps/fillers'
import Form from 'clik/elems/form'
import useActStore from 'actstore'
import actions from '../actions'
import Icon from 'clik/elems/icon'

export default ({ query, validations, photoUrl, amazonS3FaceVideo, logs, identityDocumentUrl, onSubmit, user, onReject, notes = [], id }) => {
  const { statusStep, step } = query || {}
  const [videoFile, setVideoFile] = useState()
  const ref = useRef()
  const isChanged = validations.find(item => !item.userId)

  const issues = validations.filter(item => (item.status && item.status !== 'accepted') || !item.status)

  const tabItems = [
    {
      title: 'ISSUES',
      key: 'issues',
      active: (!statusStep || statusStep == 'issues'),
      href: { query: { ...query, statusStep: 'issues' } },
      amount: issues?.length,
      component: () => <Issues items={issues} />
    },
    {
      title: 'LOGS',
      key: 'logs',
      active: statusStep == 'logs',
      href: { query: { ...query, statusStep: 'logs' } },
      amount: logs?.length,
      component: () => <Logs items={logs} />
    },
    {
      title: 'NOTES',
      key: 'notes',
      active: statusStep == 'notes',
      href: { query: { ...query, statusStep: 'notes' } },
      amount: notes?.length,
      component: () => <Notes items={notes} userId={user.id} consumerId={id} router={useRouter()} />
    }
  ]

  useEffect(() => {
    const request = new XMLHttpRequest()
    request.open('GET', amazonS3FaceVideo, true)
    request.responseType = 'blob'
    request.onload = function () {
      window.URL = window.URL || window.webkitURL
      const vdoTag = ref.current
      vdoTag && (vdoTag.src = window.URL.createObjectURL(request.response))
    }
    request.send()
  }, [])

  const isCompliance = user.role === 'compliance' && !!notes.filter(note => note.userId === user.id).length

  return (
    <div className="w:100pc h:100pc ps:rl ts:all dp:flx flxd:col">
      <div className="dp:flx flxw:wrap ps:rl of:hd br:8px mnh:180px xl-mnh:250px bd:1px-sd-blacka12 bg:white">
        { photoUrl
          ? <div className="flxb:50pc dp:flx jc:c ai:c ps:rl">
              <div className="w:100pc ps:ab t:50pc l:0 try:50npc">
                <video
                  onClick={() => ref?.current?.play()}
                  ref={ref}
                  className="w:100pc"
                  poster={photoUrl}
                  mute="true" loop={true} autoPlay={true}>
                  {videoFile && <source src={videoFile} />}
                </video>
              </div>
            </div>
          : <div className="flxb:50pc dp:flx jc:c ai:c h:100pc" />
        }
        { identityDocumentUrl ? <div className="h:100pc flxb:50pc">
            <ZoomedImage disabled={step === 'automation'} fullWidth={(step !== 'automation' && !!step) || !photoUrl} url={identityDocumentUrl} />
          </div>
          : <div className={`${classNameImage(false, !photoUrl)} dp:flx ai,jc:c h:100pc flxd:col c:prim`}>
            <Icon className="m-b:24px" icon="id-card-alt" size="3x" />
            No Document Provided
          </div>
        }
      </div>

      <div className="bg:white br:8px m-t:24px p:16px-24px h:100pc bd:1px-sd-blacka12">
        <Menu noBorder items={tabItems} />
      </div>

      <div className="dp:flx m-tb:24px">
        { !['associate', 'compliance'].includes(user.role) && <Button onClick={onReject} alert
          className={fucss({'w:100pc h:55px': true, 'm-r:24px': isChanged})}
          text="REJECT" />}
        { (isChanged || isCompliance) && <Button prim
          disabled={!!validations.find(item => !item.status) && !isCompliance}
          onClick={onSubmit}
          className="w:100pc h:55px" text="SUBMIT"
        />}
      </div>
    </div>
  )
}

const Issues = ({ items }) => {
  return <div className="w:100pc c:sec ta:c p-tb:16px m-t:16px bd-t:1px-sd-blacka12 h:100vh mnh:200px mxh:calc(100vh-636px) of:auto">
    {items.length
      ? items.map((item, index) => (
        <div key={index} className="dp:flx ai:c fs:88pc jc:sb mnh:32px">
          <div className="ta:l w:70pc">{item.label}</div>
          <div className={classNameBadge(item.status)}>{item.status || 'missing'}</div>
        </div>
      ))
      : <div className="h:100pc mnh:80px ta:c dp:flx flxd:col jc,ai:c fs:88pc">
          <Icon className="m-tb:24px w,h:48px" type="clik" icon="clipboard-check" />
          No Issues Left
        </div>
    }
  </div>
}

const Logs = ({ items }) => {
  return <div className="w:100pc c:black200 ta:c p-tb:16px m-t:16px bd-t:1px-sd-blacka12 h:100vh mnh:200px mxh:calc(100vh-636px) of:auto">
    {items.length
      ? items.map((item, index) => <Fragment>
        <div key={index} className="dp:flx ai:c jc:sb fs:98pc mnh:32px p-tb:2px crs:pt ts:p hv-bg:prima1_p-rl:4px">
          <div className="dp:flx flxw:wrap">
            <div className="ta:l m-r:5px fw:600">{item.label || item.field}</div>
            <div className={classNameBadge(item.status)}>{item.status || 'missing'}</div>
            <div> by {item?.user?.name}</div>
          </div>
          <div className="fs:80pc op:0.8">
            {setDate(item?.createdAt).split(' ').reverse().map((time, index) => <div className={fucss({ 'fs:70pc': !!index })}>{time}</div>)}
          </div>
        </div>
        {!!item.note && <span className="w:100pc bg:greya1 p:24px ta:l">{item.note}</span>}
      </Fragment>)
      : <div className="h:100pc mnh:80px ta:c dp:flx flxd:col jc,ai:c fs:88pc">
          <Icon className="m-tb:24px w,h:48px" type="clik" icon="clipboard-check" />
          No logs recorded
        </div>
    }
  </div>
}

const Notes = ({ items, consumerId, userId, router }) => {
  const { act } = useActStore(actions, [])
  const [isAdding, setIsAdding] = useState(false)
  const [noteValue, setNoteValue] = useState({ userId, consumerId, note: '' })

  const onSubmit = () => {
    act('CONSUMER_INSERT_NOTE', noteValue).then(() => {
      router.reload()
    })
  }

  return <div className="w:100pc c:black200 ta:c p-tb:16px m-t:16px bd-t:1px-sd-blacka12 h:100vh mnh:200px mxh:calc(100vh-636px) ps:rl">
    { isAdding && <NoteForm
        disabled={!noteValue.note}
        action={(value, props) => setNoteValue({ ...noteValue, note: value })}
        onSubmit={onSubmit}
        onClose={() => setIsAdding(!isAdding)}
      />
    }

    {items.length
      ? <div className="h:100pc of:auto">
          {items.map((item, index) => <Fragment>
            <div className="m-b:16px bd-b:1px-sd-blacka05">
              <div key={index} className="dp:flx ai:c jc:sb fs:90pc mnh:30px p-tb:3px crs:pt hv-bg:prima1_p-rl:4px ts:p">
                <div className="dp:flx flxw:wrap">
                  <div>Note left by {item?.user?.name}: </div>
                </div>
                <div className="fs:80pc op:0.8">
                  {setDate(item?.createdAt).split(' ').reverse().map((time, index) => <div className={fucss({ 'fs:70pc': !!index })}>{time}</div>)}
                </div>
              </div>
              {!!item.note && <span className="w:100pc p-tb:8px ta:l c:black bg:seca02 p-rl:8px">{item.note}</span>}
            </div>
          </Fragment>)}
          <Button text="Add note" action={() => setIsAdding(!isAdding)} simple className="ps:ab l,r:0 b:40npx bg:white c:prim w:100pc bd-t:1px-sd-blacka1" />
        </div>
      : <div className="h:100pc mnh:80px ta:c dp:flx flxd:col jc,ai:c fs:88pc">
          <Icon className="m-tb:24px w,h:48px" type="clik" icon="clipboard-check" />
          No logs recorded
          <Button text="Add note" action={() => setIsAdding(!isAdding)} bordered prim className="m-t:16px" />
        </div>
    }
  </div>
}

const NoteForm = ({ onClose, onSubmit, action, disabled }) => {
  const fields = [
    { name: 'note', allowEmpty: true, placeholder: 'New note', type: 'text', lightgray: true, light: true, width: '100%' },
  ]

  return <ElemPopup onClose={onClose}>
    <div className="bg:white br:8px p:24px p-t:36px dp:flx fd:col ai:c jc:sb m:auto">
      <h2 className="c:black">Note</h2>
      <div className="w:100pc m-t:20px m-b:20px">
        <Form fields={fields} action={action} />
      </div>
      <div className="w:100pc dp:flx ai:c jc:fe">
        <Button simple text="Cancel" action={onClose} />
        <Button prim disabled={disabled} text="Save" action={onSubmit} />
      </div>
    </div>
  </ElemPopup>
}


const classNameBadge = (type) => fucss({
  'p-rl:5px p-tb:2px m-r:5px br:8px fs:90pc': true,
  'bg:greya10 c:blacka12': !type,
  'bg:EDF8ED c:4CBF4C': type === 'accepted',
  'bg:F1F7FD c:7FB8ED': type === 'requested',
  'bg:FCF1F1 c:E57373': type === 'escalated'
})