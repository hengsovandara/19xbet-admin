import React, { Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import useActStore from 'actstore'
import { formatDate, formatGender } from '../../../../@clik/libs'
import actions from '../../../../@clik/actions'
import DatePicker from '../../../../@clik/elems/date-picker'
import { Button, Paragraph, Icon } from '../../../../@clik/elems/styles'
import Dropdown from '../../../../@clik/elems/select'
import TextField from '../../../../@clik/elems/textfield'

export default props => {
  const { handleChange, areas, consumer } = props
  const { id, ocr, mrz, corporation } = consumer
  const { act, store, action } = useActStore(actions)
  const { industries, jobTitles, incomes } = store.get('enums')

  const DOCUMENT_TYPES = [{ id: 1, name: 'ID Card' }, { id: 2, name: 'Passport' }]
  const GENDERS = [{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }]

  const items = [
    {
      label: 'Id Type', name: 'identityDocumentType',
      placeholder: 'ID Card', type: 'select', options: DOCUMENT_TYPES,
      value: consumer.identityDocumentType,
      ocr: ocr && ocr.identityDocumentType,
      mrz: mrz && mrz.identityDocumentType,
    },
    {
      label: 'Last Name', name: 'lastName',
      placeholder: 'John',
      value: consumer.lastName,
      ocr: ocr && ocr.lastName,
      mrz: mrz && mrz.lastName,
    },
    {
      label: 'First Name', name: 'firstName',
      placeholder: 'Appleseed',
      value: consumer.firstName,
      ocr: ocr && ocr.firstName,
      mrz: mrz && mrz.firstName,
    },
    {
      label: 'Gender', name: 'gender',
      placeholder: 'Male', type: 'select', options: GENDERS,
      value: formatGender(consumer.gender),
      ocr: ocr && ocr.gender,
      mrz: mrz && mrz.gender,
    },
    {
      label: 'Date of Birth', name: 'dateOfBirth',
      type: 'date',
      value: formatDate(consumer.dateOfBirth),
      ocr: ocr && ocr.dateOfBirth,
      mrz: mrz && mrz.dateOfBirth,
    },
    {
      label: 'Nationality', name: 'nationality',
      placeholder: 'Cambodia',
      value: consumer.nationality,
      ocr: ocr && ocr.nationality,
      mrz: mrz && mrz.nationality,
    },
    {
      label: 'Expiry Date', name: 'documentExpiredDate',
      type: 'date',
      value: formatDate(consumer.documentExpiredDate),
      ocr: ocr && ocr.documentExpiredDate,
      mrz: mrz && mrz.documentExpiredDate,
    },
    {
      label: 'City', name: 'city',
      placeholder: 'Phnom Penh', type: 'select', options: areas && areas.cities,
      value: consumer.city,
      ocr: ocr && ocr.city,
      mrz: mrz && mrz.city,
    },
    {
      label: 'Khan', name: 'district',
      placeholder: 'Chamkar Mon', type: 'select', options: areas && areas.districts,
      disabled: !consumer.city,
      value: consumer.district,
      ocr: ocr && ocr.district,
      mrz: mrz && mrz.district,
    },
    {
      label: 'Sangkat', name: 'commune',
      placeholder: 'Beong Keng Kong Ti Mouy', type: 'select', options: areas && areas.communes,
      disabled: !consumer.district,
      value: consumer.commune,
      ocr: ocr && ocr.commune,
      mrz: mrz && mrz.commune,
    },
    {
      label: 'Street', name: 'street',
      placeholder: 'Norodom Blvd',
      value: consumer.street,
    },
    {
      label: 'House Number', name: 'houseNumber',
      placeholder: '168',
      value: consumer.houseNumber,
    },
    {
      label: 'Job Title', name: 'jobTitle',
      placeholder: 'Job Title', type: 'select', options: jobTitles,
      value: consumer.jobTitle,
    },
    {
      label: 'Income', name: 'income',
      placeholder: 'Income', type: 'select', options: incomes,
      value: consumer.income,
    },
    {
      label: 'Industry', name: 'industry',
      placeholder: 'Industry', type: 'select', options: industries,
      value: consumer.industry,
    }
  ]

  return (
    <div className="p:20px">
      <div className="p:0-10px c:sec">
        <div className="dp:flx ai:c jc:fs">
          <div className="w:8pc" style={{ visibility: 'hidden' }}></div>
          <div className="w:25pc dp:flx">
            <Paragraph>OCR</Paragraph>
          </div>
          <div className="w:25pc">
            <Paragraph>MRZ</Paragraph>
          </div>
          <div className="w:50pc">
            <Paragraph>USER INPUT</Paragraph>
          </div>
        </div>
        {items.map(item => (
          <div className="dp:flx ai:c m-t:10px">
            <div className="w:8pc m-t:25px">
              <Icon style={{ color: (!!item.ocr && !!item.mrz && item.ocr === item.mrz) ? '#00d061' : '#f57167' }}>
                <FontAwesomeIcon icon={(!!item.ocr && !!item.mrz && item.ocr === item.mrz) ? 'check-circle' : 'exclamation-circle'} />
              </Icon>
            </div>
            <div className="w:100pc">
              <Paragraph label>{item.label}</Paragraph>
              <div className="dp:flx ai:c jc:sb">
                <div className="mxw:100px w:25pc">
                  <Paragraph>{item.ocr || 'N/A'}</Paragraph>
                </div>
                <div className="mxw:100px w:25pc m-l:5px">
                  <Paragraph>{item.mrz || 'N/A'}</Paragraph>
                </div>
                <div className="w:50pc m-l:5px">
                  {item.type === 'select'
                    ? renderDropdown(id, item, handleChange)
                    : item.type === 'date'
                      ? <DatePicker
                        showPicker
                        placeholder="DD/MM/YYYY"
                        value={item.value}
                        onClick={value => handleChange({ [item.name]: value, id })}
                      />
                      : <TextField
                        name={item.name}
                        value={item.value}
                        placeholder={item.placeholder}
                        action={text => handleChange({ [item.name]: text, id })}
                      />
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dp:flx p:20px-10px-0-10px">
        <div className="w:100pc ta:l">
          <Link href={props.nextStep[0].href}>
            <Button link>
              <FontAwesomeIcon icon="arrow-left" className="m-r:10px" />
              Back
            </Button>
          </Link>
        </div>
        {corporation && corporation.name !== 'Clik bank' && <div className="w:100pc ta:r">
          <Link href={props.nextStep[2].href}>
            <Button link>
              Next
              <FontAwesomeIcon icon="arrow-right" className="m-l:10px" />
            </Button>
          </Link>
        </div>}
      </div>
    </div>
  )
}

const renderDropdown = (id, item, handleChange) => {
  const handleClick = value => {
    const selected = value && (value.name || value.text) ? value.name || value.text : value
    handleChange({ [item.name]: selected, id })
  }

  return (
    <Dropdown
      showSearch
      placeholder={item.placeholder}
      options={item.options}
      value={item.value}
      disabled={item.disabled}
      onClick={handleClick}
    />
  )
}
