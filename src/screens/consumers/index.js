import React from 'react';
import Table from 'clik/elems/table'
import Status from 'clik/elems/status'
import CustomIcon from 'clik/elems/icons/customIcon'
import { Layout } from '../../@clik/comps/layout'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Consumers = ({ query: { page, keywords, status = null } }) => {
  const { act, store, action, cookies } = useActStore(actions, ['consumers', 'ready'])
  const { ready, consumers, consumersCount, user, enums, users } = store.get()
  const pagination = getPagination(page, consumersCount)

  React.useEffect(() => {
    ready && act('CONSUMERS_SUB', getPagination(page), keywords, status)
    return action('CONSUMERS_UNSUB')
  }, [page, keywords, status, ready])

  return <Layout maxWidth title="Consumers">
    {ready && <Table className="p:24px p-t:0 bg:white" light
      query={{ page, keywords }}
      pagination={pagination}
      handlePagination={page => Router.push(`/consumers?page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
      status={status}
      leftHead
      statusOptions={[ { value: null, text: 'All' }]}
      handleStatus={opt => Router.push(`/consumers?status=${opt.value}`)}
      onClickRow={['associate'].includes(user.role) && action('CONSUMERS_ASSIGN_SELF')}
      allowSelect={['manager'].includes(user.role)}
      actions={users && [{
        name: 'Users', type: 'select',
        options: users.filter(user => ['associate'].includes(user.role)).map(user => ({ value: user.id, text: user.name })),
        action: action('CONSUMERS_ASSIGN')
      }]}
      handleSearch={keywords => Router.push(`/consumers?keywords=${keywords}`)}
      fields={['account number', 'name', 'phone number', 'created at', 'wallet id']}
      data={getData(consumers)}
    />}
  </Layout>
}

export default Consumers

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items) {
  const data = items?.map(({ status, name, address, createdAt, phoneNumber, accountNumber, id, index, isWarning, photo, walletId }) => {
    const warningIcon = () => isWarning && <CustomIcon size='lg' className='w,h:0 m-l:12px' color='#ffcc66' noHover /> || null
    return {
      status: { component: Status, nospace: true, props: { title: status } },
      'account number': { value: id.replace(/\-.*/, ''), type: 'label', mobile: false },
      name: { title: { name, component: warningIcon }, subValue: address, type: 'label', full: true },
      'phone number': { value: "0" + phoneNumber, type: 'label', mobile: false },
      'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      'wallet id': { value: walletId, type: 'label', mobile: false },
      id
    }
  }) || []

  return data
}
