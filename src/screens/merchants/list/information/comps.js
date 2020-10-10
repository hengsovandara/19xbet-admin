import { useEffect, useState, useRef, Fragment } from 'react'
import { fucss } from 'next-fucss/utils'
import Router from 'next/router'
import useActStore from 'actstore'
import Form from 'clik/elems/form'
import Button from 'clik/elems/button'

import { actions } from '../hooks'

const Informations = ({ query }) => {
  const { act, store, cookies, action } = useActStore(actions)

  const { categories, dashboards, informations } = store.get('socket', 'merchants', 'merchantsCount', 'dashboards', 'categories', 'informations')

  useEffect(() => {
    cookies.get('token') && act('INFORMATION_FETCH')
  }, [])

  const [formValues, setFormValues] = React.useState(informations && informations[0])

  useEffect(() => {
    setFormValues(informations && informations[0])
  }, [informations && informations[0]])

  const handleFormValues = (value, props) => {
    setFormValues(prevFormValues => {
      if(props.name === 'phoneNumbers'){
        let phoneNumbers = prevFormValues['phoneNumbers']
        phoneNumbers[props.index] = value
        value = { phoneNumbers }
      }else{
        value = { [props.name]: value }
      }

      return{
        ...prevFormValues,
        ...value
      }
    })
  }

  const submitInformation = () => {
    act('INFORMATION_UPDATE', formValues)
      .then(() => { setFormValues({}) })
  }

  if (!categories && !dashboards && !informations)
    return <p className="c:black p:24px">Loading...</p>

  return (
    <div className={classNameWrapper({})}>
      <Form 
        fields={getFields(formValues)}
        action={handleFormValues}
      />
      <div className="w:100pc dp:flx ai:c jc:fe">
        <Button text="Cancel" simple action={() => {}} />
        <Button bordered prim text="Save" action={submitInformation} />
      </div>
    </div>
  )
}

function getFields(data) {
  if(!data)
    return []
  return [
    { name: 'email', altValue: data.email, allowEmpty: true, label: 'Email', placeholder: 'Enter email', type: 'text', lightgray: true, width: '100%', light: true, className: 'm-b:24px' },
    { name: 'facebook', altValue: data.facebook, allowEmpty: true, label: 'Facebook', placeholder: 'Enter Facebook link', type: 'text', lightgray: true, light: true, width: '100%', className: 'm-b:24px' },
    { name: 'youtube', altValue: data.youtube, allowEmpty: true, label: 'Youtube', placeholder: 'Enter Youtube link', type: 'text', lightgray: true, width: '100%', light: true, className: 'm-b:24px' },
    { name: 'twitter', altValue: data.twitter, allowEmpty: true, label: 'Twitter', placeholder: 'Enter Twitter link', type: 'text', lightgray: true, width: '100%',  light: true, className: 'm-b:24px' },
    ...(!!data?.phoneNumbers && data?.phoneNumbers?.map((phoneNumber, index) => ({
      name: 'phoneNumbers', altValue: phoneNumber, ...(index === 0 && {label: 'Phone Numbers'}), allowEmpty: false, placeholder: 'Enter Phone Numbers', type: 'text', lightgray: true, width: '100%', light: true, className: 'm-b:10px', index
    })) || [{}])
  ]
}

const classNameWrapper = ({ wrap, noSpace }) =>
  fucss({
    'md-dp:flx w:100pc flxw:wrap ai:c m-t:30px': true,
    'md-jc:sb': wrap === 'space',
    'md-jc:fs': wrap === 'start'
  })

export default Informations