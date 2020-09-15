import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import useActStore from 'actstore'
import Input from '../../../@clik/elems/input'
import Preview from '../../../@clik/elems/preview'
import { Icon } from '../../../@clik/elems/styles'
import { actions } from './hooks'

let previewMethods

const Upload = ({ merchantId, examples, document, setDocument, handleOpenUpload }) => {
  const { act, store, action, handle, route } = useActStore(actions)
  const sample = document.name ? examples.find(example => example.name === document.name) : {}
  const isChecked = document.isChecked || false
  const isValid = document.isValid || false
  const isVerified = !document.url || (isChecked && isValid)
  const isInvalid = !document.url || (isChecked && !isValid)

  const [disabledSubmit, setDisabledSubmit] = React.useState(true)

  const handleUploadDocument = async (file, props) => {
    const url = await act('APP_FILE_UPLOAD', file)
    setDisabledSubmit(false)
    setDocument({ ...document, url })
  }

  const handleVerifyDocument = isValid => { setDocument({ ...document, isChecked: true, isValid }) }

  const handleSubmit = e => handle.confirm(() => {
    document.id
      ? act('UPDATE_DOCUMENT', document.id, document.name, document.url, document.isValid)
      : act('ADD_NEW_DOCUMENT', merchantId, document.name, document.url, document.isValid, document.isChecked)
  })

  const handleDelete = e => handle.confirm(() => {
    act('DELETE_DOCUMENT', document.id)
    handleOpenUpload(false)
  })

  return (
    <div style={{ padding: '0 20px 20px' }}>
      <div className="bd-b:1px-sd-e8e8e8 p-b:20px">
        <div className="w:100pc dp:flx jc:sb">
          <div
            className="w:100pc c:blacka5 m-r:10px" style={{ minHeight: 390 }}
            onClick={() => sample.url && previewMethods.handleToggleShow(sample.url)}
          >
            {sample.url
              ? <img src={sample.url} className="md-w:90pc w:100pc mnw:200px bd:1px-sd-e8e8e8" />
              : <p className="dp:flx jc,ai:c p:20px ta:c fs:90pc fw:800" style={{ height: '100%' }}>Please choose a type of documents to view the example document.</p>
            }
          </div>

          <div
            className="mh:390px w:100pc dp:flx fd:col jc,ai:c br:4px c:blacka5 m-l:10px p:20px"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.15) , #eaecf0)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.15)',
              minHeight: 390,
            }}
          >
            {document.url && (
              <div className="ps:rl">
                <img src={document.url} width={'100%'} className="bd:1px-sd-e8e8e8" style={{ cursor: 'default' }} />
                <Icon className="ps:ab t,r:10npx">
                  <FontAwesomeIcon
                    icon={isValid ? "check-circle" : "exclamation-circle"}
                    size="lg"
                    className={classNameValidateDocument(isValid, isChecked)} />
                </Icon>
              </div>
            )}
            {document.name ? (
              <div className="dp:flx jc,ai:c w:100pc p-t:20px ">
                <Input button light
                  type="file"
                  icon="camera"
                  text={document.url ? '' : 'Upload Document'}
                  className={document.url ? classNameChangeBtn() : classNameUploadBtn()}
                  action={(file, props) => handleUploadDocument(file, props)}
                />
                {document.url &&
                  <>
                    <button
                      className="m-r:10px mnw:50px p:10px-20px c:sec bs:1 br:4px bd:1px-sd-000a15 ts:all hv-c:prim_bd:1px-sd-prim_try:2px"
                      onClick={() => previewMethods.handleToggleShow(document.url)}
                    >
                      <FontAwesomeIcon icon="eye" />
                    </button>

                    {document.id && (
                      <button
                        className="mnw:5px p:10px-20px c:sec bs:1 br:4px bd:1px-sd-blacka15 ts:all hv-c:f57167_bd:1px-sd-f57167_try:2px"
                        onClick={handleDelete}
                      >
                        <FontAwesomeIcon icon="trash-alt" />
                      </button>
                    )}
                  </>
                }
              </div>
            ) : <p className="ta:c fs:90pc fw:800">Please choose a type of documents, then you are able to upload a new document.</p>
            }
          </div>
        </div>

        <div className="w:100pc dp:flx jc:fe ai:c m-t:20px">
          <div className="dp:flx jc:sb">
            <button
              type="button"
              disabled={isInvalid}
              className={classNameButtonOutline('red', isInvalid)}
              style={{ marginRight: 20, cursor: isInvalid && 'not-allowed' }}
              onClick={() => handleVerifyDocument(false)}
            >
              Invalid
            </button>
            <button
              type="button"
              disabled={isVerified}
              className={classNameButtonOutline('prim', isVerified)}
              style={{ cursor: isVerified && 'not-allowed' }}
              onClick={() => handleVerifyDocument(true)}
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      <div className="ta:r m-t:20px">
        <button
          // disabled={disabledSubmit}
          className="mnw:100px br:4px bd:1px-sd-prim p:8px-24px fs:90pc bg:prim c:white ts:all hv-try:2px"
          style={{ cursor: false && 'not-allowed' }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Preview getMethods={methods => (previewMethods = methods)} />
    </div>
  )
}

const classNameChangeBtn = () => fucss({
  'bg:fffa9_c:sec_br:5px_fs:90pc_p:10px-20px_m-t:15px_m-r:10px_md-m-t:0_w:100pc_md-w:auto_bd:1px-sd-000a15_label hv-bs:1_bd:1px-sd-prim_c:prim_label p-b:2px_svg': true
})

const classNameUploadBtn = () => fucss({
  'bg:none_c:prim_fs:.85em_p:10px-15px_m-t:15px_md-m-t:0_w:100pc_mnw:80px_md-w:auto_lh:1.25_bd:0_mxw:120px_ws:normal_bd:1px-dashed-prim_br:0_label p-b:2px_svg': true
})

const classNameButtonOutline = (color, disabled = false) => fucss({
  'mnw:80px p:8px-24px br:4px fs:90pc ts:all hv-try:2px': true,
  'bd:1px-sd-f57167 c:f57167': color == 'red' && !disabled,
  'bd:1px-sd-prim c:prim': color == 'prim' && !disabled,
  'bg:e8e8e8 c:blacka5': disabled,
})


const classNameValidateDocument = (isValid, isChecked) => fucss({
  'bg:white br:50pc': true,
  'c:00d061': isValid && isChecked,
  'c:f57167': !isValid && isChecked,
  'c:ffd700': !isValid && !isChecked
})

export default Upload
