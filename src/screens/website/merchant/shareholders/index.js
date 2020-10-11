import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import useActStore from 'actstore'
import Shareholder from './shareholder'
import { ElemPopup } from 'clik/comps/fillers'
import Preview from 'clik/elems/preview'
import Dropdown from 'clik/elems/select'
import Photo from 'clik/elems/photo'
import { actions } from './hooks'
import Table from './table'

const Shareholders = ({ merchant, open }) => {
  const { act, store, action, handle } = useActStore(actions)
  const router = useRouter()
  const [visible, setVisible] = React.useState(false)
  const [shareholder, setShareholder] = React.useState({})
  const [shareholders, setShareholders] = React.useState(merchant?.shareholders || [])
  const [uploadDataId, setUploadDataId] = React.useState()

  let photoMethods = useRef(null)
  let previewMethods = useRef(null)

  React.useEffect(() => {
    if(open) {
      const data = (merchant?.shareholders || []).find(shareholder => shareholder.id === open) || {}
      setShareholder(data)
      setVisible(true)
    }
  }, [open])

  React.useEffect(() => {
    setShareholders(merchant.shareholders || [])
  }, [merchant?.shareholders])

  const removeQueryParams = () => {
    const { open, ...others } = router.query
    const queryParams = Object.keys(others).map(key => `${key}=${others[key]}`).join('&')
    const path = `${router.pathname}?${queryParams}`
    router.push(path, undefined, { shallow: true })
  }

  const selectShareholderType = type => {
    setVisible(true)
    const merchantId = shareholder?.merchantId || merchant.id
    setShareholder({ ...shareholder, merchantId, type: type.toLowerCase() })
  }

  const uploadFile = async (file, shareholders) => {
    const uri = await act('APP_FILE_UPLOAD', file)
    const data = shareholders.find(shareholder => shareholder.id === uploadDataId)
    const key = data.type === 'company' ? 'merchantData' : 'consumerData'
    const object = {
      id: data.merchantId,
      shareholders: {
        ...data,
        [key]: { ...data[key], uri }
      }
    }

    delete object.shareholders.merchantId
    delete object.shareholders.shareholderMerchant
    delete object.shareholders.shareholderConsumer

    act('UPDATE_MERCHANT', object)
  }

  return (
    <>
      {visible && <ElemPopup onClose={() => { removeQueryParams(); setVisible(false)}}>
        <div className="mnw:540px w:100pc c:black bg:white br:5px sh:0-1px-2px-000a15 p:16px">
          <Shareholder shareholder={shareholder} />
        </div>
      </ElemPopup>}

      <Photo
        single
        popup
        handleUserProfile={file => uploadFile(file, shareholders)}
        getMethods={methods => (photoMethods.current = methods)}
        onClose={() => photoMethods.current.handleToggleShow()}
      />

      <Preview getMethods={methods => { previewMethods.current = methods }} />

      <div className="dp:flx jc:fe">
        <div className="w:30pc m:16px">
          <Dropdown
            placeholder='Add Shareholder'
            options={['Individual', 'Company']}
            onClick={selectShareholderType}
          />
        </div>
      </div>

      <Table
        shareholders={shareholders}
        onClickPreview={uri => previewMethods.current.handleToggleShow(uri || '')}
        onClickUpload={id => {
          photoMethods.current.handleToggleShow()
          setUploadDataId(id)
        }}
      />
    </>
  )
}

export default Shareholders
