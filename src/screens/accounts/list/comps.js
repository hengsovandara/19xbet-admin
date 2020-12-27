import { useEffect, useState, useRef } from 'react'
import useActStore from 'actstore'
import { actions } from './hooks'
import Table from '../../../@clik/elems/table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Form from '../form/comps'
import Button from '../../../@clik/elems/button'
import Router from 'next/router'

const ListComps = props => {
  const { act, action, store } = useActStore(actions);
  const { query } = props;
  const [pagination, setPagination] = useState({ offset: 0, limit: 10 })
  const { accounts = [], socket, count: overall = 0, corporations = [] } = store.get('accounts', 'socket', 'count', 'corporations')

  useEffect(() => {
    async function fetchCorporations() {act('FETCH_CORPOPRATIONS')}
    fetchCorporations()
  }, [])

  useEffect(() => {
    if(socket) {
      let newPagination = query.page
                          ? { ...pagination, offset: parseInt(query.page - 1) * pagination.limit }
                          : pagination
      act('SUB_ACCOUNTS', newPagination)
      setPagination(newPagination)
    }
    return () => act('UNSUB', { id: 'accounts' })
  }, [socket, query.page])

  const handlePagination = pageNum => {
    Router.push(['/accounts', `page=${pageNum}`].join('?'))
  }

  return (
    <>
      { query.id && <Form { ...props } /> }
      <Table
        className="p:24px bg:white"
        mainAction={() => <Button small action={() => Router.push('/accounts?id=new')} name="Create new"  />}
        light
        pagination={{ ...pagination, overall }}
        handlePagination={handlePagination}
        fields={['corporation', 'role', 'photo', 'name',]}
        data={renderItem(accounts, query)}
      />
    </>
  )
}

export default ListComps

function renderItem(items, query) {
  const data = items.map(obj => {
    const { id, name, photo, role, credential } = obj
    const { corporation } = credential || {}

    return {
      id,
      _href: { pathname: '/accounts', query: { id } },
      name: { title: name && name.toUpperCase() || 'N/A', type: 'label' },
      role: { title: role || 'N/A', center: true, type: 'label' },
      corporation: { component: Corporation, props: { ...corporation }, nospace: true },
      photo: { component: Corporation, props: { logo: photo, name, isProfile: true }, noSpace: true }
    }
  })

  return data
}

const Corporation = ({ id, name = '', logo, isProfile = false }) => {
  return (
    <div className="dp:flx ai:c jc:c">
      <div className="br:50pc dp:flx jc:c ai:c w,h:45px ts:all">
        {logo && logo !== null
          ? <img src={logo} className="br:50pc w,h:100pc" />
          : <FontAwesomeIcon icon="user" />
        }
      </div>
    </div>
)}
