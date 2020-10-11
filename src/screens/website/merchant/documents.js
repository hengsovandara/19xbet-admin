import React from 'react'
import Dropdown from '../../../@clik/elems/select'
import Search from '../../../@clik/elems/table/search'
import Upload from './upload'

const Documents = ({ merchant }) => {
  const { id: merchantId, documents = [], businessTypeDocuments: examples = [] } = merchant || {}

  const [toggle, setToggle] = React.useState()
  const [document, setDocument] = React.useState({ id: '', name: '', url: '', isChecked: false, isValid: false })

  const onChangeDocumentName = (index, value) => { setDocument({ ...document, name: value.name }) }

  const handleOpenDocument = doc => {
    setToggle(true)
    setDocument(doc)
  }

  const handleOpenUpload = open => {
    setToggle(open)
    setDocument({})
  }

  return (
    <>
      <div className="p:24px">
        <div className="dp:flx jc:sb ai:c p-b:24px bd-b:1px-sd-e8e8e8">
          <button
            type="button"
            className="mnw:100px br:4px p:8px-24px fs:90pc bd:1px-sd-prim c:prim bg:white ts:all hv-try:2px"
            onClick={() => handleOpenUpload(!toggle)}
          >
            {toggle ? 'Cancel' : 'Upload'}
          </button>
          <div className="w:50pc">
            {!toggle
              ? <Search onClick={() => { }} />
              : <Dropdown
                placeholder="Choose a type of document"
                options={examples}
                value={document.name}
                onClick={(value, index) => onChangeDocumentName(index, value)}
              />
            }
          </div>
        </div>
      </div>
      {!toggle
        ? documents.length
          ? <Item documents={documents} handleOpenDocument={handleOpenDocument} />
          : <Empty />
        : <Upload
          merchantId={merchantId}
          examples={examples}
          document={document}
          setDocument={setDocument}
          handleOpenDocument={handleOpenDocument}
        />
      }
    </>
  )
}

const Item = ({ documents, handleOpenDocument }) => {

  return (
    <div className="dp:flx jc:fs p-l:12px mnh:500px" style={{ flexWrap: "wrap" }}>
      {documents.map((document, index) => (
        <div key={document.id} className="w,h:190px m:12px ts:all hv-scl:1.05">
          <div
            className="bg-c:e8e8e8 bg-ps:c bg-sz:cv bg-rp:nrp w:100pc h:180px bd:1px-sd-e8e8e8 hv-bs:2"
            style={{ backgroundImage: `url("${document.url}")` }}
            onClick={() => handleOpenDocument(document)}
          />
          <p className="fs:85pc fw:700 ta:c of:hd ws:np p-tb:12px" style={{ textOverflow: 'ellipsis' }}>{document.name}</p>
        </div>
      ))}
    </div>
  )
}

const Empty = () => {
  return (
    <div className="dp:flx jc,ai:c mnh:500px">
      <p>No Documents.</p>
    </div>
  )
}

export default Documents
