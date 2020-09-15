import { Fragment, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import Link from 'next/link'
import Router from 'next/router'
import styled from 'styled-components'
import Preview from '../../../@clik/elems/preview'
import Input from '../../../@clik/elems/input'
import { Button, Icon } from '../../../@clik/elems/styles'
import { toCapitalize } from '../../../@clik/libs'
import Dropdown from '../../../@clik/elems/select'

let previewMethods

export const Tabs = ({ tab, merchant }) => {
  const tabs = [
    { label: 'Tab1', value: 'Consumer', active: !tab, href: { query: { id: merchant && merchant.id } } },
    { label: 'Tab2', value: 'Merchant', active: tab === 'merchant', href: { query: { id: merchant && merchant.id, tab: 'merchant' } } }
  ]

  return (
    <div className="p:0-0-20px md-p:0-20px-20px">
      <div className="dp:flx jc:sb bd-b:1px-sd-e8e8e8 c:black">
        <div className="dp:flx jc:fs bd-b:1px-sd-e8e8e8 c:black">
          <button className="bg:n c:prim tt:uc fw:700 fs:110pc p-r:5px" onClick={() => Router.back()}>
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
        <p className="dp:n md-dp:ib p:12px-15px ta:c c:prim300 fs:90pc fw:800 consumer-id">ID: {merchant.referenceId || 'N/A'}</p>
      </div>
    </div>
  )
}

export const DocumentPreview = (props) => {
  const {
    id, examples, index, documentation, documentName, documentURL,
    handleChangeDocumentName, handleUploadDocument, handleDelete,
    handleCancel, handleSaveChange, setVerified, isVerified, setChecked, isChecked
  } = props
  let disabled = true
  const hasDocument = documentation && documentation.url || documentURL

  if (documentation && documentation.url || documentURL) {
    disabled = false
  }

  return (
    <div className="w:100pc c:sec">
      <div className="w;100pc dp:flx ai:c bd-b:1px-sd-grey200 p-b:15px m-b:20px fw:600">
        <p className="w:50pc">Type of Documents:</p>
        <Dropdown placeholder="Choose a type of document"
          value={documentName}
          options={examples}
          onClick={(value, index) => handleChangeDocumentName(index, value)}
        />
      </div>

      <div className="w,h:100pc dp:flx fd:col md-fd:row jc:c m-t:20px p:25px-0">
        <div
          className="md-w:40pc ta:c ps:rl"
          style={{ width: '100%', marginRight: 20, }}
          onClick={() => hasDocument && previewMethods.handleToggleShow(examples[index].url)}
        >
          {index >= 0
            ? <img src={examples[index].url} className="md-w:90pc w:100pc mnw:200px" />
            : <p className="h:100pc dp:flx jc:c ai:c ta:c c:blacka5 fs:90pc fw:800">Please choose a type of documents to view the example document.</p>
          }
        </div>
        <div
          className="md-w:60pc dp:flx fd:col jc:c ai:c p:20px br:5px"
          style={{
            width: '100%',
            background: 'linear-gradient(to right, rgba(0,0,0,0.15) , #eaecf0)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.15)'
          }}>
          {documentURL && (
            <div className="ps:rl">
              <img src={documentURL} width={'100%'} style={{ cursor: 'default' }} />
              <Icon className="ps:ab t,r:10npx">
                <FontAwesomeIcon
                  icon={isVerified ? "check-circle" : "exclamation-circle"}
                  size="lg"
                  className={classNameValidateDocument(isVerified, isChecked)} />
              </Icon>
            </div>
          )}
          <div>
            {(documentation && documentation.name || documentName) ? (
              <div className="dp:flx jc:c ai:c w:100pc p-t:20px ">
                <Input button light
                  type="file"
                  icon="camera"
                  text={hasDocument ? '' : 'Upload Document'}
                  className={hasDocument ? classNameChangeBtn() : classNameUploadBtn()}
                  action={(file, props) => handleUploadDocument(file, props)}
                />
                {hasDocument &&
                  <Button outline className="m-r:10px bg:white-! w:100pc_md-w:auto" onClick={() => previewMethods.handleToggleShow(documentURL)}>
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                }
                {documentation &&
                  <Button outline className="hv-c:red-!_bd:1px-sd-red-! bg:white-! w:100pc_md-w:auto" onClick={handleDelete}>
                    <FontAwesomeIcon icon="trash-alt" />
                  </Button>
                }
              </div>
            ) : (
                <p className="p:20px ta:c c:blacka5 fs:90pc fw:800">
                  Please choose a type of documents, then you are able to upload a new document.
                </p>
              )}
          </div>

        </div>
      </div>

      <div className="h:40px m-b:20px dp:flx jc:fe ai:c">
        <Button link
          disabled={!isVerified}
          className="m-r:20px hv-c:prim"
          style={{
            opacity: !isVerified ? '0.5' : '1',
            cursor: !isVerified ? 'not-allowed' : 'pointer'
          }}
          onClick={() => {
            setVerified(false)
            setChecked(true)
          }}
        >
          Invalid
          </Button>
        <Button link={isVerified} outline={!isVerified}
          disabled={!documentURL ? true : isVerified}
          className="w:150px c:555-! p:7px-15px-! hv-p:7px-15px-!_c:prim-!"
          style={{
            opacity: (!documentURL ? true : isVerified) ? '0.5' : '1',
            cursor: (!documentURL ? true : isVerified) ? `not-allowed` : `pointer`
          }}
          onClick={() => {
            setVerified(true)
            setChecked(true)
          }}
        >
          {isVerified ? 'Verified' : 'Verify document'}
        </Button>
      </div>

      <div className="w:100pc ta:c bd-t:1px-sd-e8e8e8 p-t:20px dp:flx fd:col md-fd:row jc:sb ai:c">
        <div className="w:100pc ta:l">
          <Button link onClick={handleCancel}>
            <FontAwesomeIcon icon="arrow-left" className="m-r:10px" />Back
          </Button>
        </div>
        <div className="w:100pc dp:flx fd:col md-fd:row od:1 md-od:2 jc:fe c:sec">
          <Button disabled
            disabled={disabled}
            className="w:150px"
            style={{ opacity: disabled ? '0.5' : '1', cursor: disabled ? 'not-allowed' : 'pointer' }}
            onClick={handleSaveChange}
          >{documentation ? 'Save change' : 'Add'}</Button>
        </div>
      </div>
      <Preview getMethods={methods => (previewMethods = methods)} />
    </div>
  )
}

export const Documents = ({ documents, setDocumentId, setDocumentName, setDocumentURL }) => (
  <Fragment>
    <p className="bd-b:1px-sd-grey200 p-b:15px m-b:20px fw:600 c:sec">Documents</p>
    <div className="dp:flx jc:fs flxw:wrap">
      {documents.map(({ id, name, url, isValid, isChecked }) => (
        <div key={id} className={classNameDoc()} onClick={() => {
          setDocumentURL(url)
          setDocumentName(name)
          setDocumentId(id)
        }}>
          <div className="p:7px bg:eee bd:1px-sd-ddd br:5px bs:1 hv-bg:prima7 hv-bd-c:prima7 crs:pt ts:all m-b:10px">
            <div
              className="h:175px bg-c:grey200 bg-sz:cv-! bg-ps:c-! ts:all ps:rl br:4px"
              style={{ backgroundImage: `url(${url})` }}
            >
              <span className={classNameValidity(isValid, url)}>
                <FontAwesomeIcon
                  icon={isValid ? 'check-circle' : 'exclamation-circle'}
                  className={classNameValidateDocument(isValid, isChecked)}
                />
              </span>
            </div>
          </div>
          <p className="fs:85pc fw:700 ta:c m-b:10px of:hd ws:np" style={{ textOverflow: `ellipsis` }}>
            {name}
          </p>
        </div>
      ))}
      <div className={classNameDoc()} onClick={() => {
        setDocumentName()
        setDocumentId({})
      }}>
        <div className="p:7px bg:eee bd:1px-dashed-ddd br:5px bs:1 hv-bg:prima7 hv-bd-c:prima7 crs:pt ts:all m-b:10px ta:c hv-c:white_svg hv-bd-c:white_div">
          <div className="bd:1px-dashed-ddd p:15px h:175px dp:flx jc:c ai:c br:4px">
            <FontAwesomeIcon icon="plus" className="fs:3em c:ddd ts:all" />
          </div>
        </div>
        <p className="fs:85pc fw:700 ta:c">Upload New Document</p>
      </div>
    </div>
  </Fragment>
)

export const BusinessInformation = ({ name, sector, size, address = {}, description }) => (
  <Fragment>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Name</label>
      <p className={classNameSubTitle(true)}>{name || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Sector</label>
      <p className={classNameSubTitle(true)}>{sector || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Business Size</label>
      <p className={classNameSubTitle()}>{toCapitalize(size) || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Address</label>
      <p className={classNameSubTitle()}>{address.addressString || 'N/A'}</p>
    </div>
    <div className={classNameGroup()}>
      <label className={classNameTitle()}>Description</label>
      <p className={classNameSubTitle()}>{description}</p>
    </div>
  </Fragment>
)

const classNameGroup = () => fucss({ 'w:100pc m-b:25px': true })
const classNameTitle = () => fucss({ 'm-b:5px': true })
const classNameSubTitle = borderBottom => fucss({
  'c:white fw:600 fs:95pc': true,
  'bd-b:2px-sd-white': borderBottom
})

const classNameValidateDocument = (isValid, isChecked) =>
  fucss({
    'c:green400': isValid && isChecked,
    'c:red400': !isValid && isChecked,
    'c:yellow600': !isValid && !isChecked
  })

const classNameDoc = () =>
  fucss({
    'w:100pc sm-w:50pc lg-w:33.33pc p:0-10px-10px c:grey': true
  })

const classNameValidity = (isValid, hasValue) =>
  fucss({
    'ps:ab t,r:16npx fs:18px bg:white br:50pc w,h:18px': true,
    'c:yellow700': !isValid && hasValue,
    'c:geen': isValid && hasValue,
    'c:red': !hasValue
  })

const classNameRow = isEven =>
  fucss({
    'dp:flx jc:fs p:15px': true,
    'bg:F8F9FC': isEven
  })

const classNameChangeBtn = () =>
  fucss({
    'bg:fffa9_c:sec_br:5px_fs:90pc_p:10px-20px_m-t:15px_m-r:10px_md-m-t:0_w:100pc_md-w:auto_bd:1px-sd-000a15_label hv-bs:1_bd:1px-sd-prim_c:prim_label p-b:2px_svg': true
  })

const classNameUploadBtn = () =>
  fucss({
    'bg:none_c:prim_fs:.85em_p:10px-15px_m-t:15px_md-m-t:0_w:100pc_mnw:80px_md-w:auto_lh:1.25_bd:0_mxw:120px_ws:normal_bd:1px-dashed-prim_br:0_label p-b:2px_svg': true
  })

const classNameTab = active =>
  fucss({
    'ps:rl bg:n p:12px-15px ts:all c:grey200 tt:uc dp:ib_ps:ab_b:3npx_h:5px_br:5px_bg:prim_span dp:flx ai:c': true,
    'c:prim400 fw:700 w:50pc_l:50pc_trx:50npc_span': active,
    'w:0_l:0_m-l:0_span dp:n': !active
  })


