import React from 'react'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paragraph, Icon, Button } from 'clik/elems/styles'
import TextField from 'clik/elems/textfield'
import Dropdown from 'clik/elems/select'
import Actheme from 'actheme'
import { useRouter } from 'next/router'

export default ({ director={} }) => {
  const router = useRouter()
  const { act, store, action } = useActStore()
  const { merchantId, data } = director
  const [values, setValues] = React.useState(director.data ||{})

  const fields = [
    { label: 'First Name', name: 'firstName', type: 'text' },
    { label: 'Last Name', name: 'lastName', type: 'text' },
    { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
    { label: 'Nationality', name: 'nationality', type: 'text' },
    { label: 'Role', name: 'role', options: ['CEO', 'Chair of Compensation Commitee'], type: 'select' },
  ]

  React.useEffect(() => {
    setValues(director.data)
  }, [director])

  const removeQueryParams = () => {
    const { open, ...others } = router.query
    const queryParams = Object.keys(others).map(key => `${key}=${others[key]}`).join('&')

    const path = `${router.pathname}?${queryParams}`
    router.push(path, undefined, { shallow: true })
  }

  const upSertDirector = () => {
    removeQueryParams()

    const data = {
      id: merchantId,
      directors: {
        ...director,
        data: values
      }
    }
    delete data.directors.merchantId
    act('MERCHANT_UPDATE', data)
  }

  const handleChange = (text, name) => {
    const value = text?.text || text?.name || text
    setValues({ ...values, [name]: value })
  }

  const textInput = field => <TextField
    {...field}
    name={field.name}
    value={values && values[field.name]}
    placeholder={field.label}
    action={text => handleChange(text, field.name)}
  />

  const selectInput = field => <>
    <Paragraph label="true">{field.label}</Paragraph>
    <Dropdown
      {...field}
      placeholder={field.label}
      options={field.options}
      value={values && values[field.name]}
      onClick={value => handleChange(value, field.name)}
    />
  </>

  return <>
    <div className="p:24px">
    <h2>Director Information</h2>
      {fields.map(field => (
        <div key={field.name} className="m-b:12px">
          { eval(`${field.type}Input(field)`) }
        </div>
      ))}
    </div>
    <Button
      className="bg:prim c:white"
      onClick={upSertDirector}
    >
      Save
    </Button>
  </>
}

