import React from 'react'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paragraph, Icon, Button } from 'clik/elems/styles'
import TextField from 'clik/elems/textfield'
import DatePicker from 'clik/elems/date-picker'
import Dropdown from 'clik/elems/select'
import Actheme from 'actheme'
import { useRouter } from 'next/router'

const [shared, setShared] = Actheme.state()

const Shareholder = ({ shareholder={} }) => {
  const router = useRouter()
  const { act, store, action } = useActStore()
  const { merchantId, shareholderMerchantId, shareholderConsumerId, type, merchantData, consumerData, id } = shareholder
  const [individualValues, setIndividualValues] = setShared({}, 'individualValues')
  const [companyValues, setCompanyValues] = setShared({}, 'companyValues')

  React.useEffect(() => {
    shared.setIndividualValues(shareholder?.consumerData)
    shared.setCompanyValues(shareholder?.merchantData)
  }, [shareholder])

  const removeQueryParams = () => {
    const { open, ...others } = router.query
    const queryParams = Object.keys(others).map(key => `${key}=${others[key]}`).join('&')
    const path = `${router.pathname}?${queryParams}`
    router.push(path, undefined, { shallow: true })
  }

  const upSertShareholder = () => {
    removeQueryParams()

    const data = {
      id: merchantId,
      shareholders: {
        ...shareholder,
        merchantData: companyValues,
        consumerData: individualValues
      }
    }
    delete data.shareholders.merchantId
    act('MERCHANT_UPDATE', data)
  }

  return <>
    { type !== 'individual' ? <Company data={merchantData} /> : <Individual data={consumerData} /> }
    <Button
      className="bg:prim c:white"
      onClick={upSertShareholder}
    >
      Save
    </Button>
  </>
}

const Individual = ({ data }) => {
  const values = shared.getIndividualValues()
  const fields = [
    {
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      ocr: null,
      mrz: null,
    },
    {
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      ocr: null,
      mrz: null,
    },
    {
      label: 'Phone Number',
      name: 'phoneNumber',
      type: 'text',
      ocr: null,
      mrz: null,
    },
    {
      label: 'Nationality',
      name: 'nationality',
      type: 'text',
      ocr: null,
      mrz: null,
    }
  ]

  React.useEffect(() => { shared.getIndividualValues(data) }, [data])

  const handleChange = (text, name) => {
    const value = text?.text || text?.name || text
    shared.setIndividualValues({ ...shared.getIndividualValues(), [name]: value })
  }

  const dateInput = field => <DatePicker
    showPicker
    placeholder="DD/MM/YYYY"
    value={values && values[field.name]}
    onClick={value => handleChange(value, field.name)}
  />

  const textInput = field => <TextField
    name={field.name}
    value={values && values[field.name]}
    placeholder={field.label}
    action={text => handleChange(text, field.name)}
  />

  const selectInput = field => <Dropdown
    showSearch
    placeholder={field.label}
    options={field.options}
    value={values && values[field.name]}
    onClick={value => handleChange(value, name)}
  />

  return (
    <div className="p:24px">
      <h2 className="m-b:24px">Individual Information</h2>
      <div className="p:0-12px c:sec">
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
        {fields.map(field => (
          <div key={field.name} className="dp:flx ai:c m-t:12px">
            <div className="w:8pc m-t:25px">
              <Icon style={{ color: (!!field.ocr && !!field.mrz && field.ocr === field.mrz) ? '#00d061' : '#f57167' }}>
                <FontAwesomeIcon icon={(!!field.ocr && !!field.mrz && field.ocr === field.mrz) ? 'check-circle' : 'exclamation-circle'} />
              </Icon>
            </div>
            <div className="w:100pc">
              <Paragraph label="true">{field.label}</Paragraph>
              <div className="dp:flx ai:c jc:sb">
                <div className="mxw:100px w:25pc">
                  <Paragraph>{field.ocr || 'N/A'}</Paragraph>
                </div>
                <div className="mxw:100px w:25pc m-l:5px">
                  <Paragraph>{field.mrz || 'N/A'}</Paragraph>
                </div>
                <div className="w:50pc m-l:5px">
                  { eval(`${field.type}Input(field)`) }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Company = ({ data }) => {
  const values = shared.getCompanyValues()
  const fields = [
    { label: 'Company Name', name: 'companyName' },
    { label: 'Business Registration Number', name: 'registrationNumber' },
    { label: 'Country of Incorporation', name: 'incorporationCountry' },
  ]

  React.useEffect(() => { shared.getCompanyValues(data) }, [data])

  const handleChange = (text, name) => shared.setCompanyValues({ ...shared.getCompanyValues(), [name]: text })

  const renderField = field => {
    const value = values && values[field?.name] || ''
    return <div key={field.name} className="m-b:12px">
      <TextField { ...field } value={value} action={(text, name) => handleChange(text, name)} />
    </div>
  }

  return (
    <div className="p:24px">
      <h2 className="m-b:24px">Company Information</h2>
      { fields.map(field => renderField(field)) }
    </div>
  )
}

export default Shareholder
