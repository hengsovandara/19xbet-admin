import React from 'react';
import Table from 'clik/elems/table'
import useActStore from 'actstore'
import actions from '../actions'
import Router from 'next/router'
import Button from 'clik/elems/button'

const Report = ({ page = 1, keywords, status }) => {
  const { act, store, action, handle } = useActStore(actions, ['news', 'ready'])
  const { ready, news = [], newsCount } = store.get()
  const pagination = getPagination(page, newsCount)

  React.useEffect(() => {
    act('NEWS_FETCH', getPagination(page, newsCount))
  }, [page, keywords, status, ready])

  const onDeleteAll = (selected = []) => {
    handle.confirm(() => act('ARTICLE_DELETE', { ids: selected.map(s=>s.value), onDone: () => act('NEWS_FETCH', getPagination(page, newsCount))}))
  }

  return ready && 
    <div>
      <Table light head allowSelect
        key={new Date().getTime()}
        query={{ page, keywords }}
        pagination={pagination}
        handlePagination={page => Router.push(`/news?page=${page}${Boolean(keywords) ? `&keywords=${keywords}` : ''}${Boolean(status) ? `&status=${status}` : ''}`)}
        leftHead
        handleSearch={keywords => {}}
        actions={news && [{
          type: 'button', bordered: true, red: true, icon: 'trash',
          action: (selected) => onDeleteAll(selected)
        }]}
        mainAction={() => <Button prim action={() => Router.push(`/news?create=true`)} text="Create new" />}
        fields={['id', 'title', 'image', 'content', 'created at', 'staff']}
        data={getData(news, {page, newsCount})}
      />
    </div>
}

export default Report

function getPagination(page, overall = 15){
  return { offset: (page ? (page - 1) : 0) * 15, limit: 15, overall }
}

const DeleteButton = props => {
  const { act, store, handle } = useActStore(actions)
  const { id, page, newsCount } = props

  const onSubmit = () => {
    handle.confirm(() => act('ARTICLE_DELETE', { ids: [id], onDone: () => act('NEWS_FETCH', getPagination(page, newsCount))}))
  }

  return <Button
      bordered
      red 
      icon={'trash'}
      action={onSubmit}
      className="p-r:0"
    />
}

function getData(items = [], extra) {
  const { page = 1, newsCount } = extra || {}
  const data = items?.map(({ id, title, content, imageUrl, createdAt, staff }) => {
    return {
      'id': { value: id, type: 'label', mobile: false },
      'title': { value: title || "unknown", type: 'label', full: true, numberOfLines: true },
      'image': { url: imageUrl || '', type: 'image', mobile: false },
      'content': { value: content || '', numberOfLines: true, mobile: false },
      'created at': { subValue: createdAt.split(' ')[0], title: createdAt.split(' ')[1], type: 'label', mobile: false },
      'staff': { value: staff?.name || 'N/A', mobile: false },
      _href: { pathname: '/news', query: { id, page } },
      // action: { component: DeleteButton, props: { id, page, newsCount } },
    }
  }) || []

  return data
}
