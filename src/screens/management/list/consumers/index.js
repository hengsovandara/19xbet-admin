import React from 'react'
import Table from 'clik/elems/table'
import Status from 'clik/elems/status'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Consumers = ({ page, keywords, status }) => {
  const { act, store, action, cookies } = useActStore(actions, ['managementConsumers'])
  const { ready, managementConsumers, managementConsumersCount, user, enums, users } = store.get()
  const pagination = getPagination(page, managementConsumersCount)

  console.log(pagination, managementConsumersCount, managementConsumers)

  React.useEffect(() => {
    act('MANAGEMENT_LIST_CONSUMERS_SUB', getPagination(page), keywords, status)
    return action('MANAGEMENT_LIST_CONSUMERS_UNSUB')
  }, [page, keywords, status])

  return ready && <Table light
    query={{ page, keywords }}
    pagination={pagination}
    handlePagination={page => Router.push(`/management?step=consumers&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
    onClickRow={['associate', 'manager'].includes(user.role) && action('MANAGEMENT_LIST_CONSUMERS_ASSIGN_SELF')}
    leftHead
    allowSelect={['manager'].includes(user.role)}
    actions={users && [{
      name: 'Users', type: 'select',
      placeholder: 'Select Users',
      options: users.map(user => ({ value: user.id, text: `${user.name} (${user.role})` })),
      action: action('MANAGEMENT_LIST_CONSUMERS_ASSIGN')
    }]}
    handleSearch={keywords => Router.push(`/management?step=consumers&keywords=${keywords}`)}
    fields={['account number', 'name', 'created at', 'submitted at']}
    data={getData(managementConsumers)}
  />
}

export default Consumers

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items) {
  const data = items?.map(({ status, name, address, createdAt, submittedAt, accountNumber, id, index, photo }) => ({
    'account number': { value: accountNumber || index, type: 'label', mobile: false },
    name: { title: name, subValue: address, type: 'label', full: true },
    'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
    'submitted at': { subValue: submittedAt.split(' ')[0], title: submittedAt.split(' ')[1], type: 'label', mobile: false },
    id,
    _href: { pathname: '/management', query: { type: 'consumer', id } }
  })) || []

  return data
}
