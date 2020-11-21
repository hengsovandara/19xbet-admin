import React from 'react';
import useActStore from 'actstore'
import { fucss } from 'next-fucss/utils'
import Form from 'clik/elems/form'
import Button from 'clik/elems/button'
import Router from 'next/router'
import actions from '../actions'

const Article = ({ id }) => {
  const { act, store } = useActStore(actions, ['article', 'ready'])
  const { ready, article = {}, loading } = store.get()
  const [ news, setNews] = React.useState(article || {})
  const [ imageFile, setImageFile] = React.useState()
  
  React.useEffect(() => {
    act("ARTICLE_FETCH", {id})
  }, [id])

  React.useEffect(() => {
    setNews(article)
  }, [article])

  const onChange = (data, props) => {
    setNews(prev => ({...prev, [props.name]: data}))
  }
  const onImageSelect = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      // this.setState({image: e.target.result});
      console.log("dara", e.target.result)
    };
    reader.readAsDataURL(event.target.files[0]);

    // console.log(window.URL.createObjectURL(file))
    // setNews(prev => ({...prev, 'imageUrl': file}))
    // setImageFile(file)
    // await act('DASHBOARD_CREATE', {file, type: 'dashboard'})
  }

  const onCancel = () => {
    Router.push('/news')
  }

  const onSave = async () => {
    await act('ARTICLE_UPSERT', news)
    onCancel()
  }

  return !!ready && <div>
      <Form 
        fields={getFields(article, onImageSelect)}
        action={onChange}
        handleUserProfile={() => {}}
      />
      <p style={{width: "fit-content"}}>Image</p>
      <div className="ta:r p-rl:12px dp:flx jc:c ai:c">
        <Button
            bordered={!news.imageUrl}
            url={news.imageUrl}
            icon={'plus'}
            type="file"
            action={onImageSelect}
            className="p-r:0 m-rl:15px"
          />
      </div>
      <div className="ta:r p-rl:12px dp:flx jc:fe ai:c">
        <Button action={onCancel}>Cancel</Button>
        <Button prim action={onSave} className="m-l:24px">Save</Button>
      </div>
    </div>
}

const classNameImage = light =>
  fucss({
    'h:175px m:5px-5px-0-0 hv-bs:2 ts:all m-b:10px': true,
    'bd:1px-sld-grey200': !light
  })

export default Article

function getFields(data, onImageSelect) {
  return [
    { name: 'title', altValue: data.title, allowEmpty: true, label: 'Title', placeholder: 'Enter Title', type: 'text', lightgray: true, width: '100%', className: 'm-b:24px' },
    { name: 'content', altValue: data.content, allowEmpty: true, label: 'Content', placeholder: 'Enter Content', type: 'textfield', lightgray: true, light: true, deep: true, width: '100%', className: 'm-b:24px', row: 15 },
  ]
}

