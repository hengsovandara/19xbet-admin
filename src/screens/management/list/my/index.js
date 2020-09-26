import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Assigned = ({ page, keywords, status }) => {
  const { act, store, action } = useActStore(actions, ['assigned'])
  const { ready, assigned, assignedCount, enums} = store.get('ready', 'assigned', 'assignedCount', 'user', 'enums')
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
    fields={['id', 'name', 'account type', 'method', 'amount', 'submitted at', 'accepted by', 'accepted at']}
    data={getData(assigned, enums)}
  />
}

export default Assigned

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items, enums = {}) {
  const data = items?.map(({ user, amount, name, type, method, createdAt, acceptedAt, id, index, staff }) => {
    const phoneNumber = user?.phoneNumber && "0" + user?.phoneNumber || 'N/A'
    const { transaction_types = {} , transaction_methods}  = enums
    const colors = {
      cashOut: 'red',
      cashIn: 'green'
    }

    return {
      'id': { value: index, type: 'label', mobile: false },
      name: { title: user?.name || "unknown", subValue: phoneNumber, type: 'label', full: true },
      'account type': { value: transaction_types?.byId[type].value || type, mobile: false, color: colors[type] },
      'method': { value: transaction_methods?.byId[method].value || method, mobile: false, color: colors[type] },
      'amount': { value: amount && "$" + amount || 'N/A', mobile: false, color: colors[type] },
      'submitted at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      'accepted at': { subValue: acceptedAt?.split(' ')[0], title: acceptedAt?.split(' ')[1], type: 'label', mobile: false },
      'accepted by': { value: staff?.name || '',  type: 'select' },
      'accepted': { value: staff?.name, type: 'label', mobile: false },
      _href: { pathname: '/management', query: { type, id } }
    }
  }) || []

  return data
}
