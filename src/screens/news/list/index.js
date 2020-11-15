import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from './actions'
import Router from 'next/router'

const Report = ({ page, keywords, status }) => {
  const { act, store } = useActStore(actions, ['news', 'ready'])
  const { ready, news = [], newsCount } = store.get()
  const pagination = getPagination(page, newsCount)
  var date = new Date();

  const [startDate, setStartDate] = React.useState(new Date(new Date().setMonth(date.getMonth() - 1)).toLocaleDateString())
  const [endDate, setEndDate] = React.useState(new Date().toLocaleDateString())

  React.useEffect(() => {
    act('NEWS_FETCH', getPagination(page, newsCount))
  }, [page, keywords, status, ready])

  const onSearched = async () => {
    await act('REPORTS_FETCH', { startDate, endDate})
  }

  return ready && 
    <div>
      <Table light head noSearch
        key={new Date().getTime()}
        query={{ page, keywords }}
        pagination={pagination}
        handlePagination={page => Router.push(`/reports?step=assigned&page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
        leftHead
        handleSearch={keywords => {}}
        fields={['id', 'title', 'image', 'content', 'created at', 'staff']}
        data={getData(news, {})}
      />
    </div>
}

export default Report

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

function getData(items = []) {
  const data = items?.map(({ id, title, content, imageUrl, createdAt, staff }) => {
    id = id && id.split("-")[0] || ''
    return {
      'id': { value: id, type: 'label', mobile: false },
      'title': { title: title || "unknown", type: 'label', full: true },
      'image': { value: imageUrl || '', type: 'image', mobile: false },
      'content': { value: content || '', mobile: false },
      'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      'staff': { value: staff?.name || 'N/A', mobile: false }
    }
  }) || []

  return data
}
