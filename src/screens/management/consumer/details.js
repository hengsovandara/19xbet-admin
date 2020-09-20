import React, { Fragment, useEffect, useState } from 'react'
import useActStore from 'actstore'
import { formatDate, formatGender } from '../../../@clik/libs'
import { Form } from './elems'

export default props => {
  const { handleChange, consumer = {}, validations, onPress, user } = props
  const { id, ocr, mrz, corporation } = consumer
  const { act, store, action } = useActStore({}, [])
  const { industries, incomes, genders, identities } = store.get('enums')
  const countries = store.get('countries')

  return <Form items={getItems()} validations={validations} onPress={onPress} />

  function getItems() {
    const getOption = (key, value = '', options = []) => options.find(option => option[key] === value) || value

    return [
      {
        label: 'Given Name', field: 'givenName',
        placeholder: 'Given Name',
        value: consumer?.givenName,
        ocr: ocr?.givenName,
        mrz: mrz?.givenName,
        disabled: !consumer?.givenName,
        options: [consumer?.givenName, ocr?.givenName, mrz?.givenName].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Surname', field: 'surname',
        placeholder: 'Surname',
        value: consumer?.surname,
        ocr: ocr?.surname,
        mrz: mrz?.surname,
        disabled: !consumer?.surname,
        options: [consumer?.surname, ocr?.surname, mrz?.surname].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Gender', field: 'gender',
        placeholder: 'Gender',
        value: getOption('value', consumer?.gender, genders),
        ocr: getOption('value', ocr?.gender, genders),
        mrz: getOption('value', mrz?.gender, genders),
        disabled: !consumer.gender,
        options: [
          getOption('value', consumer?.gender, genders),
          getOption('value', ocr?.gender, genders),
          getOption('value', mrz?.gender, genders),
          ...(genders && genders || [])
        ].filter(item => !!item?.value),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Date of Birth', field: 'dateOfBirth',
        placeholder: 'Date of Birth',
        value: consumer?.dateOfBirth,
        ocr: ocr?.dateOfBirth,
        mrz: mrz?.dateOfBirth,
        options: [consumer?.dateOfBirth, ocr?.dateOfBirth, mrz?.dateOfBirth].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Nationality', field: 'nationality',
        placeholder: 'Nationality',
        value: getOption('symbol', consumer?.nationality, countries),
        ocr: getOption('symbol', ocr?.nationality, countries),
        mrz: getOption('symbol', mrz?.nationality, countries),
        disabled: !consumer.nationality,
        options: [
          getOption('symbol', consumer?.nationality, countries),
          getOption('symbol', ocr?.nationality && String(ocr?.nationality).toLowerCase(), countries),
          getOption('symbol', mrz?.nationality && String(mrz?.nationality).toLowerCase(), countries),
          ...(countries && countries || [])
        ].filter(item => !!item),
        // options: [consumer?.nationality, ocr?.nationality, mrz?.nationality].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Place of Birth', field: 'placeOfBirth',
        placeholder: 'Place of Birth',
        value: consumer?.document?.placeOfBirth,
        ocr: ocr?.placeOfBirth,
        mrz: mrz?.placeOfBirth,
        disabled: !consumer?.document?.placeOfBirth,
        options: [consumer?.document?.placeOfBirth, ocr?.placeOfBirth, mrz?.placeOfBirth].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Document Type', field: 'type',
        placeholder: 'Document Type',
        value: getOption('value', consumer?.document?.type && String(consumer?.document?.type).toLowerCase(), identities),
        ocr: getOption('value', ocr?.type && String(ocr?.type).toLowerCase(), identities),
        mrz: getOption('value', mrz?.type && String(mrz?.type).toLowerCase(), identities),
        disabled: !consumer?.document?.type,
        options: [
          getOption('value', consumer?.document?.type, countries),
          getOption('value', ocr?.type && String(ocr?.type).toLowerCase(), identities),
          getOption('value', mrz?.type && String(mrz?.type).toLowerCase(), identities),
          ...(identities && identities || [])
        ].filter(item => !!item),
        // options: [consumer?.document?.type, ocr?.type, mrz?.type].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Document Number', field: 'number',
        placeholder: 'Document Number',
        value: consumer?.document?.number,
        disabled: !consumer?.document?.number,
        ocr: ocr?.number,
        mrz: mrz?.number,
        options: [consumer?.document?.number, ocr?.number, mrz?.number].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Expiry Date', field: 'dateOfExpiry',
        placeholder: 'Expiry Date',
        value: consumer?.document?.dateOfExpiry,
        ocr: ocr?.dateOfExpiry,
        mrz: mrz?.dateOfExpiry,
        disabled: !consumer?.document?.dateOfExpiry,
        options: [consumer?.document?.dateOfExpiry, ocr?.dateOfExpiry, mrz?.dateOfExpiry].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Issue Date', field: 'dateOfIssue',
        placeholder: 'Issue Date',
        value: consumer?.document?.dateOfIssue,
        ocr: ocr?.dateOfIssue,
        mrz: mrz?.dateOfIssue,
        disabled: !consumer?.document?.dateOfIssue,
        options: [consumer?.document?.dateOfIssue, ocr?.dateOfIssue, mrz?.dateOfIssue].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Industry', field: 'industry',
        placeholder: 'Industry',
        value: consumer?.occupation?.industry,
        disabled: !consumer?.occupation?.industry,
        options: [consumer?.occupation?.industry, ...industries.map(item => item.value || item)].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Job Title', field: 'title',
        placeholder: 'Job Title',
        value: consumer?.occupation?.title,
        disabled: !consumer?.occupation?.title,
        options: [consumer?.occupation?.title].filter(item => !!item),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
      {
        label: 'Monthly Income', field: 'income',
        placeholder: 'Monthly Income',
        value: getOption('value', consumer?.occupation?.income, incomes),
        disabled: !consumer?.occupation?.income,
        reverse: true,
        options: [getOption('value', consumer?.occupation?.income, incomes), ...(incomes && incomes || [])].filter(item => !!item?.value),
        disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
      },
    ]
  }
}
