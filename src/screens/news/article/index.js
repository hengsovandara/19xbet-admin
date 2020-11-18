import React from 'react';
import Input from 'clik/elems/input'
import Form from 'clik/elems/form'
import useActStore from 'actstore'
import actions from '../actions'

const Article = ({ id }) => {
  const { act, store } = useActStore(actions, ['article', 'ready'])
  const { ready, article = {}, loading } = store.get()
  
  React.useEffect(() => {
    act("ARTICLE_FETCH", {id})
  }, [])

  return !!ready && <div>
      <Form 
        fields={getFields(article)}
        action={() => {}}
      />
    </div>
}

export default Article

function getFields(data) {
  return [
    { name: 'title', altValue: data.title, allowEmpty: true, label: 'Title', placeholder: 'Enter Title', type: 'text', lightgray: true, width: '100%', className: 'm-b:24px' },
    { name: 'content', altValue: data.content, allowEmpty: true, label: 'Content', placeholder: 'Enter Content', type: 'textfield', lightgray: true, light: true, deep: true, width: '100%', className: 'm-b:24px', row: 15 },
    { name: 'image', altValue: data.content, allowEmpty: true, label: 'Image', placeholder: 'Enter Content', type: 'file', lightgray: true, light: true, width: '100%', className: 'm-b:24px' },
  ]
}
