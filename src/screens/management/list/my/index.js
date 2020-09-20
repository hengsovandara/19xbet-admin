import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Assigned = ({ page, keywords, status }) => {
  const { act, store, action } = useActStore(actions, ['assigned'])
  const { ready, assigned, assignedCount} = store.get('ready', 'assigned', 'assignedCount', 'user', 'enums')
  const pagination = getPagination(page, assignedCount)

  React.useEffect(() => {
    act('ASSIGNED_SUB', getPagination(page), keywords, status)
    return action('ASSIGNED_UNSUB')
  }, [page, keywords, status])

  return ready && <Table light
    key={new Date().getTime()}
    query={{ page, keywords }}
    pagination={pagination}
    handlePagination={page => Router.push(`/management?step=assigned&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
    leftHead
    handleSearch={keywords => Router.push(`/management?step=assigned&keywords=${keywords}`)}
    fields={['account number', 'name', 'account type', 'created at', 'submitted at', 'assigned at', 'assigned by']}
    data={getData(assigned)}
  />
}

export default Assigned

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items) {
  const data = items?.map(({ user, address, name, type, createdAt, submittedAt, assignedAt, id, consumer, merchant, assigner }) => {
    const objectId = consumer ? consumer.id : merchant.id
    const accountNumber = consumer ? consumer?.accountNumber || consumer?.index : merchant?.accountNumber || merchant?.index
    return {
      'account number': { value: accountNumber, type: 'label', mobile: false },
      name: { title: name, subValue: address, type: 'label', full: true },
      'account type': { value: type, mobile: false },
      'assigned to': { value: user?.name || 'N/A', mobile: false },
      'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      'submitted at': { subValue: submittedAt.split(' ')[0], title: submittedAt.split(' ')[1], type: 'label', mobile: false },
      'assigned at': { subValue: assignedAt.split(' ')[0], title: assignedAt.split(' ')[1], type: 'label', mobile: false },
      'assigned by': { value: assigner?.name || 'N/A' },
      id,
      _href: { pathname: '/management', query: { type, id: objectId } }
    }
  }) || []

  return data
}
