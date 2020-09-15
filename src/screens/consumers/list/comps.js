import { useEffect, useState } from 'react'
import Router from 'next/router'
import useActStore from 'actstore'
import Table from '../../../@clik/elems/table'
import Status from '../../../@clik/elems/status'
import Logo from '../../../@clik/elems/logo'
import Match from '../../../@clik/elems/match'
import Icons from '../../../@clik/elems/icons'
import { ElemProgressCircle } from '../../../@clik/comps/fillers'
import { actions } from './hooks'

export default ({ query }) => {
  const { act, store, cookies, action } = useActStore(actions)
  let { socket, consumers, consumersCount } = store.get('socket', 'consumers', 'consumersCount')

  const [pagination, setPagination] = useState({ offset: 0, limit: 15, overall: 0 })
  const [totalPage, setTotalPage] = useState()
  const [statusName, setStatusName] = useState()

  function setPage(page) {
    const { limit } = pagination

    if (!page) {
      return pagination
    }

    const offset = (page - 1) * limit
    const newPagination = { ...pagination, offset }
    setPagination(newPagination)
    return newPagination
  }

  function handleStatus({ id, value }) {
    if (id === undefined) {
      Router.push(`/consumers`)
    } else {
      Router.push(`/consumers?status=${id}`)
    }
    const newPage = setPage(1)
    setStatusName(value)
    act('CONSUMERS_SUB', { statusId: id, ...newPage })
  }

  function handleSearchName(name) {
    if (name !== '') {
      Router.push(`/consumers?name=${name}`)
    } else {
      Router.push(`/consumers`)
    }
    act('CONSUMERS_SUB', { name, ...pagination })
  }

  function handlePagination(page) {
    const newPage = setPage(page)

    if (query.status) {
      Router.push(`/consumers?status=${query.status}&page=${page}`)
      act('CONSUMERS_SUB', { statusId: query.status, ...newPage })
    } else if (query.name) {
      Router.push(`/consumers?name=${query.name}&page=${page}`)
      act('CONSUMERS_SUB', { name: query.name, ...newPage })
    } else {
      Router.push(`/consumers?page=${page}`)
      act('CONSUMERS_SUB', { ...newPage })
    }
  }

  // useEffect(() => {
  //   let { page, status, name } = query
  //   if (!status && !name && !page) {
  //     console.log("fuck")
  //     socket && cookies.get('token') && act('CONSUMERS_SUB', { offset: 0, limit: 15, overall: 0 })
  //     return action('CONSUMERS_UNSUB')
  //   }

  // }, [query])

  useEffect(() => {
    let { page, status, name } = query

    if (status) {
      const numberOfPages = consumersCount && page && page > totalPage ? totalPage : page
      const newPage = setPage(numberOfPages)

      totalPage && numberOfPages && Router.replace(`/consumers?status=${status}&page=${numberOfPages}`)
      socket && cookies.get('token') && act('CONSUMERS_SUB', { statusId: status, ...newPage })
      return action('CONSUMERS_UNSUB')
    }

    if (!status && !name) {
      const numberOfPages = consumersCount && page && page > totalPage ? totalPage : page
      const newPage = setPage(numberOfPages)

      totalPage && numberOfPages && Router.replace(`/consumers?page=${numberOfPages}`)
      socket && cookies.get('token') && act('CONSUMERS_SUB', { ...newPage })
      return action('CONSUMERS_UNSUB')
    }

    if (!status && name) {
      const numberOfPages = consumersCount && page && page > totalPage ? totalPage : page
      const newPage = setPage(numberOfPages)

      totalPage && numberOfPages && Router.replace(`/consumers?name=${name}&page=${numberOfPages}`)
      socket && cookies.get('token') && act('CONSUMERS_SUB', { name, ...newPage })
      return action('CONSUMERS_UNSUB')
    }
  }, [socket])

  useEffect(() => {
    const { page } = query

    const totalPage = consumersCount && Math.ceil(consumersCount / 15)
    setTotalPage(totalPage)

    if (consumersCount || consumersCount == 0) {
      setPagination({ ...pagination, overall: consumersCount })
    }
  }, [consumersCount])

  if (!consumers) {
    return null
  }

  return <Table light hasValidator
    query={query}
    pagination={pagination}
    handlePagination={handlePagination}
    status={statusName}
    handleClick={handleStatus}
    handleSearch={handleSearchName}
    fields={['status', 'face match', 'source', 'name', 'icons', 'completeness', 'created At']}
    data={renderItem(consumers)}
  />
}

function renderItem(items) {
  const data = items.map(({ status, corporation, match, isMerchant, source, name, address, percentage, createdAt, id, amazonS3FaceImage, amazonS3IdDocument, amazonS3FaceVideo, assignment }) => ({
    status: { component: Status, nospace: true, props: { title: status, assignment, id }, center: true },
    'face match': { component: Match, props: { isMatched: match, isMerchant }, mobile: true },
    source: { component: Logo, props: { source, corporation }, center: true, mobile: false },
    name: { title: name, subValue: address, bold: true, full: true },
    icons: { component: Icons, props: { amazonS3FaceImage, amazonS3IdDocument, amazonS3FaceVideo }, type: 'label', mobile: false, center: true },
    completeness: { component: ElemProgressCircle, props: { score: percentage }, center: true },
    'created At': { value: createdAt, type: 'label', mobile: false, center: true },
    id,
    _href: { pathname: '/consumers', query: { id } }
  }))

  return data
}
