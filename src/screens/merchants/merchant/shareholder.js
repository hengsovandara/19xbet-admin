import React from 'react'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paragraph, Icon } from '../../../@clik/elems/styles'
import TextField from '../../../@clik/elems/textfield'
import DatePicker from '../../../@clik/elems/date-picker'

const Shareholder = () => {
  const { act, store, action } = useActStore()

  // NON CLIK ACCOUNT

  const items = React.useMemo(() => {
    return [
      {
        label: 'Last Name', name: 'lastName',
        placeholder: 'John',
        value: '',
        ocr: null,
        mrz: null,
      },
      {
        label: 'First Name', name: 'firstName',
        placeholder: 'Appleseed',
        value: '',
        ocr: null,
        mrz: null,
      },
      {
        label: 'Date of Birth', name: 'dateOfBirth',
        type: 'date',
        value: '',
        ocr: null,
        mrz: null,
      },
      {
        label: 'Nationality', name: 'nationality',
        placeholder: 'Cambodia',
        value: '',
        ocr: null,
        mrz: null,
      },
    ]
  }, [])

  const handleChange = (text, id) => {
    console.log(text)
  }

  const handleClick = React.useCallback(value => {
    const selected = value && (value.name || value.text) ? value.name || value.text : value
    handleChange({ [item.name]: selected, id: '' })
  }, [])

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
                    ? <Dropdown
                      showSearch
                      placeholder={item.placeholder}
                      options={item.options}
                      value={item.value}
                      disabled={item.disabled}
                      onClick={handleClick}
                    />
                    : item.type === 'date'
                      ? <DatePicker
                        showPicker
                        placeholder="DD/MM/YYYY"
                        value={item.value}
                        onClick={value => handleChange({ [item.name]: value, id: '' })}
                      />
                      : <TextField
                        name={item.name}
                        value={item.value}
                        placeholder={item.placeholder}
                        action={text => handleChange({ [item.name]: text, id: '' })}
                      />
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )


  // IS CLIK ACCOUNT

  // const [values, setValues] = React.useState({
  //   companyName: '',
  //   businessNumber: '',
  //   incorporationCountry: ''
  // })

  // const { companyName, businessNumber, incorporationCountry } = values

  // return (
  //   <div className="p:20px">
  //     <h2>Information</h2>
  //     <div className="m-b:10px">
  //       <TextField label="Company Name" name="" value={companyName} action={text => handleChange(text)} />
  //     </div>
  //     <div className="m-b:10px">
  //       <TextField label="Business Registration Number" name="" value={businessNumber} action={text => handleChange(text)} />
  //     </div>
  //     <div className="m-b:10px">
  //       <TextField label="Country of Incorporation" name="" value={incorporationCountry} action={text => handleChange(text)} />
  //     </div>
  //   </div>
  // )
}

export default Shareholder
