import React from 'react'
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Consumers = ({ page, keywords, status }) => {
  const { act, store, action, cookies } = useActStore(actions, ['managementConsumers'])
  const { ready, managementConsumers, managementConsumersCount, user, enums, users } = store.get()
  const pagination = getPagination(page, managementConsumersCount)

  React.useEffect(() => {
    act('MANAGEMENT_LIST_REQUESTED_SUB', getPagination(page), keywords, status)
    return action('MANAGEMENT_LIST_REQUESTED_UNSUB')
  }, [page, keywords, status])

  return ready && <Table light
    query={{ page, keywords }}
    pagination={pagination}
    handlePagination={page => Router.push(`/management?step=requested&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
    leftHead
    handleSearch={keywords => Router.push(`/management?step=requested&keywords=${keywords}`)}
    fields={['account number', 'name', 'created at', 'submitted at']}
    data={getData(managementConsumers)}
  />
}

export default Consumers

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items) {
  const data = items?.map(({ name, address, createdAt, submittedAt, accountNumber, id, index }) => ({
    'account number': { value: accountNumber || index, type: 'label', mobile: false },
    name: { title: name, subValue: address, type: 'label', full: true },
    'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
    'submitted at': { subValue: submittedAt.split(' ')[0], title: submittedAt.split(' ')[1], type: 'label', mobile: false },
    id,
    _href: { pathname: '/management', query: { type: 'consumer', id } }
  })) || []

  return data
}
