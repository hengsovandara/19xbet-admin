import { useEffect, useState } from 'react'
import Router from 'next/router'
import useActStore from 'actstore'
import Table from '../../../@clik/elems/table'
import Logo from '../../../@clik/elems/logo'
import Status from '../../../@clik/elems/status'
import Icons from '../../../@clik/elems/icons'


import { ElemProgressCircle } from '../../../@clik/comps/fillers'
import { actions } from './hooks'

export default ({ query }) => {

  const { act, store, cookies, action } = useActStore(actions)
  const { socket, merchants, merchantsCount } = store.get('socket', 'merchants', 'merchantsCount')

  const [pagination, setPagination] = useState({ offset: 0, limit: 15, overall: 15 })
  const [statusName, setStatusName] = useState()

  // console.log({ pagination })

  // console.log({ socket })

  useEffect(() => {
    // console.log('mount')
    let { status, name, page = 1 } = query
    const offset = merchantsCount && (page - 1) * pagination.limit
    const newPagination = merchantsCount ? { ...pagination, offset } : pagination

    socket && cookies.get('token') && act('MERCHANTS_SUB', { statusId: status, name, ...newPagination })
    return action('MERCHANTS_UNSUB')
  }, [socket])

  useEffect(() => {
    // console.log({ merchantsCount })
    const { page = 1 } = query

    if (merchantsCount || merchantsCount == 0) {
      const offset = (page - 1) * 15
      setPagination({ ...pagination, offset, overall: merchantsCount })
    }
  }, [merchantsCount])

  useEffect(() => {
    // console.log('mount 2')
    // console.log('overall', {pagination})
    const { status, name, page = 1 } = query
    // console.log({ ...pagination })
    const totalPage = Math.ceil(pagination.overall / pagination.limit) || 1
    let newPagination = pagination

    if (page > totalPage) {
      newPagination = { ...pagination, offset: 0 }
      Router.push('/merchants')
    }

    socket && cookies.get('token') && act('MERCHANTS_SUB', { statusId: status, name, ...newPagination })
    return action('MERCHANTS_UNSUB')
  }, [pagination])

  function handlePagination(page) {
    let { status, name } = query
    const offset = (page - 1) * pagination.limit
    const newPagination = { ...pagination, offset }
    setPagination(newPagination)
    status && Router.push(`/merchants?status=${status}&page=${page}`)
    name && Router.push(`/merchants?name=${name}&page=${page}`)
    page && !name && !status && Router.push(`/merchants?page=${page}`)
    act('MERCHANTS_SUB', { statusId: status, name, ...newPagination })
  }

  function handleStatus({ id, value }) {
    setStatusName(value)
    id === undefined ? Router.push(`/merchants`) : Router.push(`/merchants?status=${id}`)
    act('MERCHANTS_SUB', { statusId: id, ...pagination })
  }

  function handleSearchName(name) {
    Router.push(`/merchants?name=${name}`)
    act('MERCHANTS_SUB', { name, ...pagination })
  }

  if (!merchants)
    return <p className="c:black p:20px">Loading...</p>

  // if(!merchants.length)
  //   return <h1 className="c:black">No Merchants!</h1>

  return (
    <Table
      light
      query={query}
      pagination={pagination}
      handlePagination={handlePagination}
      status={statusName}
      handleClick={handleStatus}
      handleSearch={handleSearchName}
      fields={['status', 'source', 'name', 'icons', 'completeness', 'created At']}
      data={merchants.map(({ status, source, name, address, percentage, createdAt, id, documents, assignment }) => ({
        status: { component: Status, nospace: true, props: { title: status, assignment, id }, center: true },
        source: { component: Logo, props: { source }, center: true },
        name: { title: name, subValue: address, bold: true, full: true },
        icons: { component: Icons, props: { documents }, type: 'label', mobile: false, center: true },
        completeness: { component: ElemProgressCircle, props: { score: percentage }, center: true },
        'created At': { value: createdAt, type: 'label', mobile: false, center: true },
        id,
        _href: { pathname: '/merchants', query: { id } }
      }))}
    />
  )
}
