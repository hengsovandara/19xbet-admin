import { useEffect, useState, useRef } from 'react'
import useActStore from 'actstore'
import { actions } from './hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ElemPopup } from '../../../@clik/comps/fillers'
import Router from 'next/router'
import Form from '../../../@clik/elems/form'
import Button from '../../../@clik/elems/button'
import Photo from '../../../@clik/elems/photo'

export default props => {
  const { act, action, store } = useActStore(actions);
  const { query } = props;
  let { account = {}, socket, corporations = [] } = store.get('account', 'socket', 'corporations')
  const [formState, setFormState] = useState(account)
  let photoMethods = useRef(null)

  corporations = corporations.map(({ id, name }) => {return { value: id, text: name }})

  useEffect(() => {
    if(socket && query.id && query.id !== 'new') act('SUB_AN_ACCOUNT', { id: query.id })
    return () => query.id !== 'new' && act('UNSUB_AN_ACCOUNT', { id: 'account' })
  }, [query && query.id, socket])

  useEffect(() => setFormState(account), [account && Object.keys(account).length])

  const handleFormState = async (value, props) => {
    let newState = props.table
    ? {...formState, [props.table]: { ...(formState[props.table] || {}), [props.name]: value }}
    : {...formState, [props.name]: value}
    setFormState(newState)
  }

  const handleSave = obj => act('UPSERT_ACCOUNT', obj).then(() => Router.push('/accounts'))

  return <ElemPopup onClose={() => Router.push('/accounts')}>
    <Photo
      single
      popup
      // user={user}
      handleUserProfile={async file => {
        const url = await act('APP_FILE_UPLOAD', file)
        handleFormState(url, { name: 'photo' })
      }}
      getMethods={methods => (photoMethods.current = methods)}
      onClose={() => photoMethods.current.handleToggleShow()}
      action={res => console.log('photo action', res)}
    />
    <div className="bg:white bs:2 p:40px-50px br:5px c:black bs:0-1px-5px-000a3 w:500px ta:l">
      <div>
        <h2 className="fw:300">Account Information</h2>
        <p className="m-b:24px bd-b:grey200-sld-1px p-b:5px fs:80pc">Enter / Edit account information here</p>
      </div>

      <div
        className='dp:flx flxd:col jc:c ai:c m-rl:auto fs:80pc m-b:5px'
        title="Add/Change image here"
      >
        <div
          onClick={() => photoMethods.current.handleToggleShow()}
          className="bd:1px-sd-prim br:50pc hv-try:2px dp:flx jc:c ai:c w,h:50px ts:all profile-img"
        >
          {formState && formState.photo
            ? <img src={formState.photo} className="br:50pc w,h:100pc" />
            : <FontAwesomeIcon icon="plus" size="lg" />
          }
        </div>
        Add/Change photo here
      </div>

      <Form
        action={handleFormState}
        data={formState}
        fields={formFields(formState, corporations)}
        ids={[ formState && formState.id ]}
        edit={true} nospace
      />

      <div className="ta:r p-rl:12px dp:flx jc:fe ai:c">
        <Button action={e => handleSave()}>Cancel</Button>
        <Button prim action={e => handleSave(formState)} className="m-l:24px">Save</Button>
      </div>
    </div>
  </ElemPopup>
}

const roles = [
  { text: 'admin', value: 'admin' },
  { value: 'manager', text: 'manager' },
  { value: 'associate', text: 'associate' },
  { value: 'compliance', text: 'compliance' },
  { value: 'validator', text: 'validator' },
]

const formFields = (account, corporations) => {
  const { credentials, role, name, photo, email } = account || {}
  const { corporationId, phoneNumber } = credentials || {}

  return ([
    { className: 'm-r:12px', lightgray: true, type: 'select', width: '47%', placeholder: 'Corporation', options: corporations, name: 'corporationId', table: 'credentials', altValue: corporationId },
    { className: 'm-r:12px', lightgray: true, type: 'select', width: '47%', value: role, placeholder: 'Account role', options: roles, name: 'role'},
    { className: 'm-r:12px', lightgray: true, type: 'text', width: '47%', value: name, light: true, placeholder: 'Account Name', name: 'name' },
    { className: 'm-r:12px', lightgray: true, type: 'text', width: '47%', value: email, light: true, placeholder: 'Account Email', name: 'email' },
    { lightgray: true, type: 'text', altValue: phoneNumber, light: true, placeholder: 'Phone Number', name: 'phoneNumber', table: 'credentials' }
  ])
}
