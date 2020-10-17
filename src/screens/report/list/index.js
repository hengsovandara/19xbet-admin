import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'
import Button from 'clik/elems/button'
import DatePicker from 'clik/elems/date-picker'

const Report = ({ page, keywords, status }) => {
  const { act, store, action } = useActStore(actions, ['reports'])
  const { ready, reports = {}, enums} = store.get('ready', 'reports', 'assignedCount', 'user', 'enums')
  const pagination = getPagination(page, 0)
  const { data = [], totalAmount = 0 } = reports || {}
  var date = new Date();

  const [startDate, setStartDate] = React.useState(new Date(new Date().setMonth(date.getMonth() - 1)).toLocaleDateString())
  const [endDate, setEndDate] = React.useState(new Date().toLocaleDateString())

  React.useEffect(() => {
    act('REPORTS_FETCH', { startDate, endDate})
  }, [page, keywords, status])

  const onDateSelected = ({type, date}) => {
    if(type === 'startDate')
      setStartDate(date)
    else
      setEndDate(date)
  }

  const onSearched = async () => {
    await act('REPORTS_FETCH', { startDate, endDate})
  }

  return ready && 
    <div>
      <div className="dp:flx p-tb:15px w:100pc">
        <div className="p-rl:10px w:200px">
          <p>Start Date</p>
          <DatePicker value={startDate} onClick={(date) => onDateSelected({date, type: "startDate"})}/>
        </div>
        <div className="p-rl:10px w:200px">
          <p>End Date</p>
          <DatePicker value={endDate} onClick={(date) => onDateSelected({date, type: "endDate"})}/>
        </div>
        <div className="p-rl:10px">
          <p className="c:white">search</p>
          <Button icon='search' text="Search" bordered prim action={onSearched} />
        </div>
      </div>
      <Table light head noSearch noTableHead
        key={new Date().getTime()}
        query={{ page, keywords }}
        pagination={pagination}
        handlePagination={page => Router.push(`/reports?step=assigned&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
        leftHead
        handleSearch={keywords => {}}
        fields={['id', 'name', 'account type', 'method', 'amount', 'submitted at', 'accepted by', 'accepted at']}
        data={getData(data, enums)}
        totalAmount={totalAmount}
      />
    </div>
}

export default Report

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items = [], enums = {}) {
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
      'accepted': { value: staff?.name, type: 'label', mobile: false }
    }
  }) || []

  return data
}
