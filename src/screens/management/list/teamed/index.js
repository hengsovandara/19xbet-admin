import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Teamed = ({ page, keywords, status }) => {
  const { act, store, action } = useActStore(actions, ['teamed'])
  const { ready, teamed, teamedCount, user } = store.get('ready', 'teamed', 'teamedCount', 'user', 'enums')
  const pagination = getPagination(page, teamedCount)

  React.useEffect(() => {
    act('TEAMED_SUB', getPagination(page), keywords, status)
    return action('TEAMED_UNSUB')
  }, [page, keywords, status])

  return ready && <Table light
    query={{ page, keywords }}
    pagination={pagination}
    handlePagination={page => Router.push(`/management?step=teamed&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
    onClickRow={['manager', 'complience'].includes(user.role) && action('TEAMED_ASSIGN_SELF')}
    leftHead
    handleSearch={keywords => Router.push(`/management?step=teamed&keywords=${keywords}`)}
    fields={['account number', 'name', 'account type', 'created at', 'submitted at', 'assigned at', 'assigned by']}
    data={getData(teamed)}
  />
}

export default Teamed

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
      'account type': { value: type },
      'assigned to': { value: user?.name || 'N/A' },
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
