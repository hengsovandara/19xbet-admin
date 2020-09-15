import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from '../../../../@clik/elems/select'
import { Button, Input, Paragraph, Icon } from '../../../../@clik/elems/styles'

const Index = ({ consumer, handleChange, nextStep }) => {
  const { extraInfo } = consumer

  const GENDERS = [{ id: '1', name: 'Male' }, { id: '2', name: 'Female' }]
  const MARITAL_STATUS = [
    { id: '1', name: 'Single' },
    { id: '2', name: 'Married' },
    { id: '3', name: 'Divorce' }
  ]

  const columns = [
    {
      label: 'Mnemonic',
      name: 'mnemonic',
      value: extraInfo && extraInfo.mnemonic,
      placeholder: 'Mnemonic'
    },
    {
      label: 'Amret Staff',
      name: 'amretStaff',
      value: extraInfo && extraInfo.amretStaff,
      placeholder: 'Amret Staff'
    },
    {
      label: 'Marital Status',
      name: 'maritalStatus',
      value: extraInfo && extraInfo.maritalStatus,
      placeholder: 'Marital Status',
      options: MARITAL_STATUS,
      type: 'select'
    },
    {
      label: 'Employment Status',
      name: 'employmentStatus',
      value: extraInfo && extraInfo.employmentStatus,
      placeholder: 'Employment Status'
    }
  ]

  return (
    <div className="p:20px w:100pc">
      {columns.map((column, index) => (
        <div key={column.name} className="dp:flx w:100pc m-t:5px m-b:5px">
          <Icon
            style={{
              color: column.value ? '#00d061' : '#f57167'
            }}
          >
            <FontAwesomeIcon
              icon={column.value ? 'check-circle' : 'exclamation-circle'}
            />
          </Icon>
          <div className="ta:l w:100pc m-l:20px">
            <Paragraph label="true">{column.label}</Paragraph>
            {column.type === 'select' && (
              <Dropdown
                showSearch
                options={column.options}
                placeholder={column.placeholder}
                value={column.value}
                disabled={column.disabled}
                onClick={value => {
                  column.value !== ((value && value.name) || value) && handleChange({
                    extraInfo: {
                      ...extraInfo,
                      [column.name]: (value && value.name) || value
                    },
                    id: consumer.id
                  })
                }}
              />
            )}
            {!column.type && (
              <Input
                type="text"
                style={{
                  color: column.value && '#134168',
                  fontWeight: column.value && 'bold'
                }}
                placeholder={column.label}
                defaultValue={column.value}
                onKeyUp={e =>
                  e.keyCode === 13 && column.value !== e.target.value &&
                  handleChange({
                    extraInfo: {
                      ...extraInfo,
                      [column.name]: e.target.value
                    },
                    id: consumer.id
                  })
                }
                onBlur={e => {
                  column.value !== e.target.value && handleChange({
                    extraInfo: {
                      ...extraInfo,
                      [column.name]: e.target.value
                    },
                    id: consumer.id
                  })
                }}
              />
            )}
          </div>
        </div>
      ))}
      <div className="dp:flx p-t:20px">
        <div className="w:100pc ta:l">
          <Link href={nextStep[1].href}>
            <Button link>
              <FontAwesomeIcon icon="arrow-left" className="m-r:10px" />
              Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Index
