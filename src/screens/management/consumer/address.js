import React, { useEffect, useState } from 'react'
import { Form } from './elems'
import useActStore from 'actstore'
import actions from './actions'

export default props => {
  const { consumer, validations, onPress, user } = props
  const { id, corporation } = consumer || {}
  const ocr = consumer.ocr || {}
  const mrz = consumer.mrz || {}
  const address = consumer?.address || {}
  const { act, store, action } = useActStore(actions, [])
  const { countries } = store.get('enums', 'countries')
  const [areas, setAreas] = useState()

  const getValidation = field => validations.find(validation => validation.field === field) || {}

  useEffect(() => {
    act('APP_AREAS_FETCH', {
      city: getValidation('city').value,
      district: getValidation('district').value,
      commune: getValidation('commune').value
    }).then(({cities, communes, districts}) => {
      const country = getValidation('country').value || ''
      const newData = {
        cities: ['Cambodia (កម្ពុជា)', 'Kh', 'kh'].includes(country) ? cities : [],
        districts:  ['Cambodia (កម្ពុជា)', 'Kh', 'kh'].includes(country) ? districts : [],
        communes:  ['Cambodia (កម្ពុជា)', 'Kh', 'kh'].includes(country) ? communes : [],
      }
      setAreas(newData)
    })
  }, [getValidation('country').value, getValidation('city').value, getValidation('district').value])

  return <Form items={getItems()} validations={validations} onPress={onPress} />

  function getItems() {
    const getCountry = (value = '') => countries.find(country => country.symbol === value)

    return [
      {
        label: 'Country', field: 'country',
        placeholder: 'Country',
        options: [getCountry(address.country), getCountry(ocr.country), getCountry(mrz.country), ...(countries && countries || [])].filter(item => !!item),
        value: getCountry(address.country),
        ocr: getCountry(ocr.country),
        mrz: getCountry(mrz.country),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'City', field: 'city',
        placeholder: 'City',
        options: [ address.city, ocr.city && ocr.city, mrz.city && mrz.city, ...(areas && areas.cities || []) ].filter(item => !!item),
        value: address.city,
        ocr: ocr && ocr.city,
        mrz: mrz && mrz.city,
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Khan', field: 'district',
        placeholder: 'Khan',
        options: [ address.district, ocr.district && ocr.district, mrz.district && mrz.district, ...(areas && areas.districts || [])  ].filter(item => !!item),
        disabled: !address.city,
        value: address.district,
        ocr: ocr && ocr.district,
        mrz: mrz && mrz.district,
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Sangkat', field: 'commune',
        placeholder: 'Sangkat',
        options: [ address.commune, ocr.commune && ocr.commune, mrz.commune && mrz.commune, ...(areas && areas.communes || [])  ].filter(item => !!item),
        disabled: !address.district,
        value: address.commune,
        ocr: ocr && ocr.commune,
        mrz: mrz && mrz.commune,
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Street', field: 'street',
        placeholder: 'Street',
        disabled: !address.street,
        options: [address.street].filter(item => !!item),
        value: address.street,
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'House Number', field: 'houseNumber',
        placeholder: 'House Number',
        disabled: !address.houseNumber,
        options: [address.houseNumber].filter(item => !!item),
        value: address.houseNumber,
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      }
    ]
  }
}
