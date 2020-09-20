import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import useActStore from 'actstore'
import Director from './director'
import { ElemPopup } from 'clik/comps/fillers'
import Preview from 'clik/elems/preview'
import { Button } from 'clik/elems/styles'
import Photo from 'clik/elems/photo'
import { actions } from './hooks'
import Table from './table'

export default ({ merchant, open }) => {
  const { act, store, action, handle } = useActStore(actions)
  const router = useRouter()
  const [visible, setVisible] = React.useState(false)
  const [director, setDirector] = React.useState({})
  const directors = merchant?.directors || []
  const [uploadDataId, setUploadDataId] = React.useState()

  let photoMethods = useRef(null)
  let previewMethods = useRef(null)

  React.useEffect(() => {
    if(open) {
      const data = (merchant?.directors || []).find(director => director.id === open) || {}
      setDirector(data)
      setVisible(true)
    }
  }, [open])

  const removeQueryParams = () => {
    const { open, ...others } = router.query
    const queryParams = Object.keys(others).map(key => `${key}=${others[key]}`).join('&')
    const path = `${router.pathname}?${queryParams}`
    router.push(path, undefined, { shallow: true })
  }

  const onPressAdd = () => {
    setVisible(true)
    const merchantId = director?.merchantId || merchant.id
    setDirector({ ...director, merchantId })
  }

  const uploadFile = async (file, directors) => {
    const uri = await act('APP_FILE_UPLOAD', file)
    const director = directors.find(director => director.id === uploadDataId)
    const object = {
      id: director.merchantId,
      directors: {
        ...director,
        data: { ...director.data, uri }
      }
    }

    delete object.directors.merchantId
    delete object.directors.consumer

    act('UPDATE_MERCHANT', object)
  }

  return (
    <>
      {visible && <ElemPopup onClose={() => { removeQueryParams(); setVisible(false)}}>
        <div className="mnw:540px w:100pc c:black bg:white br:5px sh:0-1px-2px-000a15 p:16px">
          <Director director={director} />
        </div>
      </ElemPopup>}

      <Photo
        single
        popup
        handleUserProfile={file => uploadFile(file, directors)}
        getMethods={methods => (photoMethods.current = methods)}
        onClose={() => photoMethods.current.handleToggleShow()}
      />

      <Preview getMethods={methods => { previewMethods.current = methods }} />

      <div className="dp:flx jc:fe">
        <Button className="c:white-! bg:prim m:16px" onClick={onPressAdd} >
          Add Director
        </Button>
      </div>

      <Table
        directors={directors}
        onClickPreview={data => previewMethods.current.handleToggleShow(data?.uri || '')}
        onClickUpload={id => {
          photoMethods.current.handleToggleShow()
          setUploadDataId(id)
        }}
      />
    </>
  )
}

