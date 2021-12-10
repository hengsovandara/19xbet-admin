import React from 'react';
import useActStore from 'actstore'
import { fucss } from 'next-fucss/utils'
import Form from 'clik/elems/form'
import Button from 'clik/elems/button'
import Router from 'next/router'
import actions from '../actions'

const Article = ({ id, page = 1, create }) => {
  const { act, store, handle } = useActStore(actions, ['promotion', 'ready'])
  const { ready, promotion = {}, loading, user } = store.get()
  const [ eachPromotion, setPromotion] = React.useState(promotion || {})
  const [ imageFile, setImageFile] = React.useState()
  
  React.useEffect(() => {
    act("PROMOTION_FETCH", {id})
  }, [id])

  React.useEffect(() => {
   setPromotion(promotion)
  }, [promotion])

  const onChange = (data, props) => {
   setPromotion(prev => ({...prev, [props.name]: data}))
  }
  const onImageSelect = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
     setPromotion(prev => ({...prev, "imageUrl": e.target.result}))
      setImageFile(file[0])
    };
    reader.readAsDataURL(file[0]);
  }

  const onCancel = () => {
    Router.push(`/promotions`)
  }

  const onSave = async () => {
    await act('PROMOTION_UPSERT', eachPromotion, imageFile, onCancel )
  }

  const onDelete = async () => {
    handle.confirm(() => act('PROMOTION_DELETE', { ids: [eachPromotion.id], onDone: onCancel}))
  }

  return !!ready && <div>
      <Form 
        fields={getFields(eachPromotion)}
        action={onChange}
        handleUserProfile={() => {}}
      />
      <p style={{width: "fit-content"}}>Image</p>
      <div className="ta:r p-rl:12px dp:flx jc:c ai:c">
        <Button
            bordered={!eachPromotion.imageUrl}
            url={eachPromotion.imageUrl || ''}
            icon={'plus'}
            type="file"
            action={onImageSelect}
            className="p-r:0 m-rl:15px"
          />
      </div>
      <div className="ta:r p-rl:12px dp:flx jc:fe ai:c m-t:10px">
        <Button action={onCancel}>Cancel</Button>
        <Button disabled={((!eachPromotion.title || !eachPromotion.content) && !eachPromotion.imageUrl )} prim action={onSave} className="m-l:24px">Save</Button>
        {!!id && <Button action={onDelete} className="m-l:24px bg:red400 c:white">Delete</Button>}
      </div>
    </div>
}

export default Article

function getFields(data) {
  return [
    { name: 'title', altValue: data.title, allowEmpty: true, label: 'Title', placeholder: 'Enter Title', type: 'text', lightgray: true, width: '100%', className: 'm-b:24px' },
    { name: 'content', altValue: data.content, allowEmpty: true, label: 'Content', placeholder: 'Enter Content', type: 'textfield', lightgray: true, light: true, deep: true, width: '100%', className: 'm-b:24px', row: 15 },
  ]
}

