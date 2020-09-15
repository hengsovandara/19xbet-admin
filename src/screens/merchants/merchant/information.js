import React from 'react'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paragraph } from '../../../@clik/elems/styles'
import TextField from '../../../@clik/elems/textfield'
import { actions } from './hooks'

const Information = ({ merchant }) => {
  const { act, store, action, handle, route } = useActStore(actions)

  const items = React.useMemo(() => {
    return [
      {
        label: 'Company Name',
        name: 'companyName',
        value: merchant?.companyName,
      },
      {
        label: 'Incorporate Date',
        name: 'incorporateDate',
        value: merchant?.incorporationDate,
      },
      {
        label: 'Country of Incorporation',
        name: 'incorporationCountry',
        value: merchant?.incorporationCountry,
      },
      {
        label: 'Company Registration Number',
        name: 'registrationNumber',
        value: merchant?.registrationNumber,
      },
      {
        label: 'Business Activities',
        name: 'businessActivities',
        value: merchant?.businessActivities,
      }
    ]
  }, [])

  const handleChange = (name, text) => {
    act('MERCHANT_UPDATE', { id: merchant.id, [name]: text })
  }

  return (
    <div className="p:20px c:sec">
      <div className="dp:flx ai:c jc:fs">
        <div className="w:8pc" style={{ visibility: 'hidden' }}></div>
        <div className="w:100pc dp:flx">
          <div className="w:40pc m-r:10npx">
            <Paragraph>OCR</Paragraph>
          </div>
          <div className="w:60pc">
            <Paragraph>USER INPUT</Paragraph>
          </div>
        </div>
      </div>
      {items.map(item => (
        <div key={item.name} className="dp:flx ai:fe ta:l m-tb:10px">
          <div className="w:8pc dp:flx ai:c jc:c">
            <div className="w:100pc m-b:8px">
              <FontAwesomeIcon
                icon={false ? 'check-circle' : 'exclamation-circle'}
                color={false ? '#00d061' : '#f57167'}
              />
            </div>
          </div>
          <div className="w:100pc dp:flx jc:sb ai:fe">
            <div className="w:40pc">
              <label className="c:blacka5 fs:80pc">{item.label}</label>
              <p className="lh:2.35 fs:90pc fw:bold">{'N/A'}</p>
            </div>
            <div className="w:60pc">
              <TextField placeholder={item.label} name={item.name} value={item.value} action={text => handleChange(item.name, text)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


export default Information
