import React from 'react';
import Table from 'clik/elems/table'
import Status from 'clik/elems/status'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Merchants = ({ query = {} }) => {
  const { act, store, action, cookies } = useActStore(actions, ['socket', 'merchants', 'totalCount'])
  const { socket, merchants, totalCount } = store.get('socket', 'merchants', 'totalCount')
  // const [statusName, setStatusName] = React.useState()
  const [pagination, setPagination] = React.useState({ offset: 0, limit: 15, overall: 15 })

  React.useEffect(() => {
    let { name, page = 1 } = query
    const offset = totalCount && (page - 1) * pagination.limit
    const newPagination = totalCount ? { name, ...pagination, offset } : pagination

    socket && act('DASHBOARD_FETCH', { ...newPagination })
    return action('MERCHANTS_UNSUB')
  }, [socket])

  React.useEffect(() => {
    const { page = 1 } = query

    if (totalCount || totalCount == 0) {
      const offset = (page - 1) * 15
      setPagination({ ...pagination, offset, overall: totalCount })
    }
  }, [totalCount])

  React.useEffect(() => {
    const { status, name, page = 1 } = query
    const totalPage = Math.ceil(pagination.overall / pagination.limit) || 1
    let newPagination = pagination

    if (page > totalPage) {
      newPagination = { ...pagination, offset: 0 }
      Router.push('/management?step=merchants')
    }

    socket && act('DASHBOARD_FETCH', { name, ...newPagination })
    return action('MERCHANTS_UNSUB')
  }, [pagination])

  // const handleStatus = ({ id, value }) => {
  //   setStatusName(value)
  //   id === undefined ? Router.push(`/management?step=merchants`) : Router.push(`/management?step=merchants&status=${id}`)
  //   act('DASHBOARD_FETCH', { statusId: id, token, ...pagination })
  // }

  const handleSearchName = (name) => {
    Router.push(`/management?step=merchants&name=${name}`)
    act('DASHBOARD_FETCH', { name, token, ...pagination })
  }

  const handlePagination = (page) => {
    let { status, name } = query
    const offset = (page - 1) * pagination.limit
    const newPagination = { ...pagination, offset }
    setPagination(newPagination)
    // status && Router.push(`/management?step=merchants&status=${status}&page=${page}`)
    name && Router.push(`/management?step=merchants&name=${name}&page=${page}`)
    page && !name && Router.push(`/management?step=merchants&page=${page}`)
    act('DASHBOARD_FETCH', { name, ...newPagination })
  }

  return <Table light
    query={query}
    pagination={pagination}
    handlePagination={handlePagination}
    // status={statusName}
    // handleClick={handleStatus}
    handleSearch={handleSearchName}
    fields={['status', 'account number', 'name', 'created', 'submitted']}
    data={renderItem(merchants)}
  />
}

export default Merchants

function renderItem(items) {
  const data = items?.map(({ status, name, address, createdAt, id, submittedAt }) => ({
    status: { component: Status, nospace: true, props: { title: status }, center: true },
    'account number': { value: id, type: 'label', mobile: false, center: true },
    name: { title: name, subValue: address, bold: true, full: true },
    created: { title: createdAt.split(' ')[0], subValue: createdAt.split(' ')[1], type: 'label', mobile: false, center: true },
    submitted: { title: submittedAt.split(' ')[0], subValue: submittedAt.split(' ')[1], type: 'label', mobile: false, center: true },
    id,
    // _href: { pathname: '/merchants', query: { id } }
  })) || []

  return data
}
