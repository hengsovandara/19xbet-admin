import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'
import Button from 'clik/elems/button'

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
    fields={['id', 'name', 'account type', 'method', 'amount', 'submitted at', 'accepted by', 'accepted at', 'action']}
    data={getData(assigned, enums)}
  />
}

export default Assigned

const Buttons = props => {
  const { act, store } = useActStore(actions)
  const { user } = store.get('ready', 'user')

  const onSubmit = async (status) => {
    await act('TRANSACTIONS_UPDATE', { status, staffId: user.id, id: props.id})
  }

  return <div className="dp:flx ai:c">
    <Button
      bordered
      green
      icon={'check-double'}
      action={() => onSubmit('accepted')}
      className="p-r:0 m-r:15px"
    />
    <Button
      bordered
      red
      icon={'trash'}
      action={() => onSubmit('rejected')}
      className="p-r:0"
    />
  </div>
}

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items, enums = {}) {
  const data = items?.map(({ user, amount, type, method, createdAt, acceptedAt, id, index, staff, status }) => {
    const phoneNumber = user?.phoneNumber && "0" + user?.phoneNumber || 'N/A'
    const { transaction_types = {} , transaction_methods}  = enums
    const colors = {
      cashOut: 'red',
      cashIn: 'green',
      accepted: 'green',
      rejected: 'red'
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
      _href: { pathname: '/management', query: { type, id } },
      action: status !== 'requested' ? { value: status, color: colors[status], type: 'label', mobile: false } : { component: Buttons, props: { id, status } },
    }
  }) || []

  return data
}
