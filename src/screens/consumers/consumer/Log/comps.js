import { Fragment, useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import Particles from 'react-particles-js'
import styled from 'styled-components'
import Preview from '../../../../@clik/elems/preview'
import Input from '../../../../@clik/elems/input'
import { Button, Scrollable } from '../../../../@clik/elems/styles'
import Markdown from 'markdown-to-jsx'
import { setDate } from '../../../../@clik/libs'
import { classNameRow, classNameBg, classNameLogBtn, classNameLogNot, classNamePhoneBtn, classNameChangeBtn, classNameUploadBtn, classNameImage, classNameLogInput, classNameLogSendBtn } from './elems'

let previewMethods

export default ({ flag, photoUrl, amazonS3FaceVideo, documentUrl, percentage, identityDocumentUrl, update, upload, data, id, activities, setInvalid, setIsUpdated, setIsLocked }) => {
  const [toggle, setToggle] = useState(false)
  const [focus, setFocus] = useState(false)
  const [note, setNote] = useState('')
  const [videoFile, setVideoFile] = useState()
  const ref = useRef()

  useEffect(() => {
    var request = new XMLHttpRequest()
    request.open('GET', amazonS3FaceVideo, true)
    request.responseType = 'blob'
    request.onload = function () {
      const reader = new FileReader()
      reader.readAsDataURL(request.response)
      reader.onload = function (e) {
        // setVideoFile(e.target.result.replace('application/x-www-form-urlencoded', 'video/mp4'));
        setVideoFile(e.target.result.replace('application/x-www-form-urlencoded', 'video/mp4'))
        setTimeout(() => ref.current && ref.current.play(), 2000)
        // console.log(videoFile);
      }
    }
    request.send()
    // console.log({ amazonS3FaceVideo })
  }, [])

  const handleUpdate = () => {
    setIsUpdated(true)
    setIsLocked(false)
  }

  const handleLocked = () => {
    setInvalid(true)
    setIsLocked(true)
  }

  const count = activities && activities.length

  return (
    <div className="w:100pc md-w:38pc md-m-l:2pc md-od:2 br:5px bg:6BC4BC bg:white m-b:10px md-m-b:0 of:hd bd:1px-sd-e8e8e8">
      <div className="dp:flx flxw:wrap ps:rl">
        {photoUrl ? (
          <div className="flxb:50pc dp:flx jc:c ai:c mnh:200px md-mnh:250px bg:white ps:rl" style={{ position: 'relative' }}>
            <div className="w:100pc ps:ab t:50pc l:0 try:50npc">
              <video
                ref={ref}
                className="w:100pc"
                poster={photoUrl}
                mute loop autoPlay>
                {videoFile && <source src={videoFile} />}
              </video>
            </div>
            <div className={classNameImage()}>
              <Input name="selfie" tiny color="white" text="Change" className={classNameChangeBtn()} button icon="camera" noSpace type="file" data={data} action={upload} />
            </div>
          </div>
        ) : (
            <div className="flxb:50pc dp:flx jc:c ai:c mnh:200px md-mnh:250px bg:white">
              <Input name="selfie" className={classNameUploadBtn()} button text="Upload Selfie" icon="camera" light type="file" data={data} action={upload} />
            </div>
          )}
        {identityDocumentUrl ? (
          <div style={{ backgroundImage: `url(${identityDocumentUrl})` }} className={classNameImage(document)} onClick={() => previewMethods.handleToggleShow(identityDocumentUrl)}>
            <Input name="document" tiny color="white" text="Change" className={classNameChangeBtn()} button icon="id-card" noSpace type="file" data={data} action={upload} />
          </div>
        ) : (
            <div className="flxb:50pc dp:flx jc:c ai:c mnh:200px md-mnh:250px bd-l:1px-sd-e8e8e8 bg:white">
              <Input icon="id-card" name="document" className={classNameUploadBtn()} text="Upload Document" button light type="file" data={data} action={upload} />
            </div>
          )}
        <Preview getMethods={methods => (previewMethods = methods)} />
      </div>
      <div className={classNameBg(toggle)}>
        {!toggle && (
          <Fragment>
            <div className="ps:ab t,l:0 h:100pc w:100pc">
              <Particles
                className="h:100pc w:100pc op:0.5"
                params={{
                  particles: {
                    number: {
                      value: 8
                    },
                    size: {
                      value: 2,
                      anim: {
                        speed: 0,
                        size_min: 0.3
                      }
                    },
                    move: {
                      random: true
                    }
                  }
                }}
              />
            </div>
            <div className="w:100pc m-t:20px m-b:30px ps:rl">
              <div className="dp:flx jc:sb m-b:5px fs:.85em fw:600">
                <p>
                  <span>Progress</span>
                </p>
                <p>
                  <span>{flag.length} / 5 Flags</span>
                </p>
              </div>
              <div className="w:100pc p:2px ps:rl bg:whitea3 br:5px lh:1">
                <span style={{ width: `${percentage}%` }} className={classNameProgress(percentage)}>
                  {percentage + '%'}
                </span>
              </div>
            </div>
            <div className="dp:flx fd:col m-tb:20px ps:rl">
              <Button className="bg:white-! c:prim-! m-b:8px"
                disabled={data.status === 8}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button className="bg:white-! c:prim-! m-b:8px"
                style={{
                  cursor: data.status === 4 ? 'not-allowed' : 'pointer',
                  opacity: data.status === 4 ? '0.5' : '1'
                }}
                disabled={data.status === 4}
                onClick={() => update({ status: 4, id })}
              >
                {data.status === 4 ? `Verified` : `Verify`}
              </Button>
              <Button outline className="w:100pc mnw:150px c:white-! hv-bd:1px-sd-f57167-!_bg:f57167-!"
                style={{
                  cursor: data.status === 8 ? 'not-allowed' : 'pointer',
                  opacity: data.status === 8 ? '0.5' : '1'
                }}
                disabled={data.status === 8}
                onClick={handleLocked}
              >
                Lock
              </Button>
            </div>
          </Fragment>
        )}
        <div className="dp:flx jc:sb ai:c w:100pc ps:rl p-t:10px">
          <button onClick={() => setToggle(!toggle)} className={`${classNameLogBtn(toggle)}`}>
            LOG<span className={classNameLogNot(toggle)}>{count}</span>
          </button>
          {toggle && (
            <div className="ps:rl m-rl:15px">
              <form
                onSubmit={e => {
                  e.preventDefault()
                  update({ note, id })
                  setNote('')
                }}>
                <input autoComplete="off" type="text" placeholder="Note" name="note" onChange={e => setNote(e.target.value)} value={note} onFocus={() => setFocus(true)} onBlur={() => setFocus()} className={classNameLogInput(focus)} />
                <button type="submit" disabled={note === ''} className={classNameLogSendBtn(focus && note !== '')}>
                  <FontAwesomeIcon icon="paper-plane" />
                </button>
              </form>
            </div>
          )}
          <button className={classNamePhoneBtn(toggle)}>
            <FontAwesomeIcon icon="phone" />
          </button>
        </div>
        {toggle && (
          <Scrollable className="w:100pc mxh:600px of-y:scroll m-t:20px ps:rl">
            <div className="w:100pc c:black ta:c">
              {data.activities.map((log, index) => (
                <div key={index} className={classNameRow(index % 2)}>
                  <Markdown className="ta:l fw:400 fs:85pc m-r:10px">{log.note}</Markdown>
                  <div className="dp:flx jc:sb c:prim fs:75pc m-tb:10px p-t:10px">
                    <span>{log.owner.name}</span>
                    <span className="ta:r">{setDate(log.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Scrollable>
        )}
      </div>
    </div>
  )
}

const classNameProgress = percentage => fucss({
  'mnw:12pc h:24px p-t:1px br:4px jc:c c:white fw:600 dp:flx ai:c m:0': true,
  'bg:f57167': percentage < 50,
  'bg:orange': percentage >= 50 && percentage < 90,
  'bg:green': percentage >= 90,
})