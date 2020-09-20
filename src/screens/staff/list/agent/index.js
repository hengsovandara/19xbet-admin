import React from 'react';
import Table from 'clik/elems/table'
import Button from 'clik/elems/button'
import { UserForm } from '../../elems'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Staff = ({ page, keywords, status = null }) => {
  const { act, store, action, cookies } = useActStore(actions, ['staff', 'ready'])
  const { ready, staff, staffCount, user, enums } = store.get()

  const [isAdding, setIsAdding] = React.useState(false)
  const [formValues, setFormValues] = React.useState({})
  const pagination = getPagination(page, staffCount)
  const isCreatable = ['admin', 'manager'].includes(user.role)

  React.useEffect(() => {
    ready && act('STAFF_SUB', getPagination(page), keywords, status)
    return action('STAFF_UNSUB')
  }, [page, keywords, status, ready])

  const handleFormValues = (value, props) => setFormValues({...formValues, [props.name]: value})

  const submitUser = () => {
    act('USER_CREATE', formValues)
      .then(() => { setIsAdding(false); setFormValues({}) })
  }

  return ready && <>
    { isAdding && <UserForm
        type='user'
        roles={enums.role}
        loginUser={user}
        data={formValues}
        title="Account Information"
        action={handleFormValues}
        onSubmit={submitUser}
        onClose={() => setIsAdding(!isAdding)}
      />
    }
    <Table light
      query={{ page, keywords }}
      pagination={pagination}
      handlePagination={page => Router.push(`/staff?page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
      mainAction={() => isCreatable && <Button prim action={() => setIsAdding(!isAdding)} text="Create new" />}
      leftHead
      allowSelect={['manager'].includes(user.role)}
      handleSearch={keywords => Router.push(`/staff?keywords=${keywords}`)}
      fields={['name', 'role', 'created by', 'created at']}
      data={getData(staff)}
    />
  </>
}

export default Staff

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items) {
  const data = items?.map(({name, createdAt, id, role }) => {

    return {
      name: { title: name, type: 'label', full: true },
      role: { title: role, type: 'label', full: true },
      'created by': { value: 'N/A' },
      'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      id,
      _href: { pathname: '/staff', query: { id } }
    }
  }) || []

  return data
}