import React from 'react'
import useActStore from 'actstore'
import actions from './actions'
import Icon from 'clik/elems/icon'
import Button from 'clik/elems/button'
import { UserForm, Confirmation } from '../elems'
import { toCapitalize, timeSince } from 'clik/libs'

const User = ({ query }) => {
  const { id } = query
  const { act, store, action } = useActStore(actions, [])
  const { user: loginUser, enums, ready } = store.get('ready', 'user', 'enums')

  const [formType, setFormType] = React.useState('user')
  const [confirmationType, setConfirmationType] = React.useState('delete')
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [user, setUser] = React.useState({})
  const [formValues, setFormValues] = React.useState({})
  const [changePinValues, setChangePinValues] = React.useState({ id: loginUser.id})

  const [assignments, setAssignments] = React.useState([])

  React.useEffect(() => {
    id && act('USER_USER_FETCH', id).then(data => { setUser(data); setFormValues(data)})
  }, [])

  const isYourself = ready && !!Object.keys(user).length && loginUser.id === user.id || false
  const isSuperior = ready && loginUser.role === 'admin'

  const isEditable = isYourself || isSuperior
  const isDeleteable = isSuperior
  const isChangePinable = isYourself
  const isResetable = isSuperior

  const handleFormValues = (objects, setObjects) => (value, props) => setObjects({...objects, [props.name]: value})

  const submitUser = () => {
    act('USER_UPDATE', formValues).then(() => {
      setIsEditing(false)
      act('USER_USER_FETCH', id).then(data => { setUser(data); setFormValues(data)})
    })
  }

  const changeUserPin = () => act('USER_CHANGE_PIN', changePinValues).then(() => setIsEditing(false))

  const data = formType === 'user' ? formValues : changePinValues
  const onChange = formType === 'user' ? handleFormValues(formValues, setFormValues) : handleFormValues(changePinValues, setChangePinValues)
  const title = formType === 'user' ? 'Edit Account Information' : 'Change Pin Information'
  const onSubmit = formType === 'user' ? submitUser : changeUserPin

  return id && ready && !!Object.keys(user).length && <div className="w:100pc h:100pc bg:blacka06">
    { isEditing && <UserForm
        type={formType}
        loginUser={loginUser}
        roles={enums.role}
        data={data}
        title={title}
        action={onChange}
        onSubmit={onSubmit}
        onClose={() => setIsEditing(!isEditing)}
      />
    }

    { isDeleting && <Confirmation
        title={confirmationType === 'delete' ? "Delete User" : "Reset Pin"}
        subText={`Do you want to ${confirmationType === 'delete' ? 'delete' : 'reset pin of'} this user?`}
        onDone={confirmationType === 'delete' ? action("USER_DELETE", user.id) : action("USER_RESET_PIN", user.id)}
        onClose={() => setIsDeleting(false)}
      />
    }

    <div className="dp:flx mdx-flxd:col md-jc:sb p:24px md-h:calc(100vh-70px)">
      <LeftComp
        user={user}
        permissions={{isEditable, isDeleteable, isChangePinable, isResetable}}
        actions={{
          onEdit: () => { setIsEditing(!isEditing); setFormType('user') },
          onChangePin: () => { setIsEditing(!isEditing); setFormType('changePin') },
          onDelete: () => { setIsDeleting(true); setConfirmationType('delete') }
        }}
      />

      <RightComp assignments={assignments} />
    </div>
  </div> || <p>User Not Found</p>
}

function brokenImageBackup(ev){
  ev.target.src = 'https://i.imgur.com/Ut4LRBn.png'
}

const LeftComp = ({ user = {}, actions, permissions }) => {
  const { onEdit, onChangePin, onResetPin, onDelete } = actions
  const { isEditable = false, isDeleteable = false, isChangePinable = false, isResetable = false } = permissions || {}

  return <div className="w:100pc md-w:30pc md-mnw:300px xl-w:360px mdx-m-b:24px bg:white bd:1px-sd-blacka12 br:8px of:auto">
    <div className="w,h:100pc p-rl:24px p-t:64px dp:flx flxd:col jc:sb ps:rl">
      { isEditable && <Button className="w:auto ps:ab t,r:24px" link action={onEdit}>Edit</Button> }

      <div className="dp:flx fd:col jc:c ai:c m-b:24px">
        <div className="br:50pc w,h:100px ts:all profile-img m-b:24px">
          <img src={user?.photo || 'https://i.imgur.com/Ut4LRBn.png'} onError={brokenImageBackup} className="br:50pc w,h:100pc" />
        </div>

        <p className="m-b:8px fw:600 fs:20px">{user?.name || 'Unknown'}</p>
        <p className="c:grey">{user?.role && toCapitalize(user.role) || 'Unknown role'}</p>
      </div>

      <div className="m-b:24px">
        <Row data={user?.email} icon="envelope" />
        <Row data={user?.phoneNumber} icon="phone-alt" />
      </div>

      <Label label="AGENT CODE" data={'N/A'} bold={true} />

      <div className="m-b:24px">
        <Label label="CREATED BY" data={'N/A'} />
        <Label label="DATE CREATED" data={user?.createdAt} />
      </div>

      <div className="dp:flx flxw:wrap jc:sb m-b:24px">
        { isEditable && <Button
            action={onEdit}
            bordered
            icon="pen"
            className={`w:100pc ${isDeleteable && 'w:calc(50pc-8px)'}`}
            text="Edit"
          />
        }
        { isDeleteable && <Button
            action={onDelete}
            bordered
            alert
            icon="trash-alt"
            className={`w:100pc ${isEditable && 'w:calc(50pc-8px)'}`}
            text="Delete"
          />
        }
      </div>
    </div>
  </div>
}

const RightComp = ({ assignments }) => {
  return <div className="w:100pc md-w:calc(70pc-24px) xl-w:calc(100pc-360px) md-m-l:24px bg:white br:8px p:24px">
    <div className="w,h:100pc ta:l p-r:24px of:auto">
      <h3 className="c:black fw:600 tt:uc m-b:24px">Activity</h3>
      {assignments.filter(assignment => !!assignment.finished).map((assignment, i) => (
        <div className={`bd-t:1px-sd-blacka12 p:16px ${i % 2 === 0 && 'bg:seca02'}`}>
          <p className="black200 m-b:8px">
            {assignment?.user?.name} finished {assignment?.consumer?.giveName || ""} {assignment?.consumer?.surname || ""}'s case
          </p>
          <p className="c:grey400 fs:90pc">{timeSince(assignment.finishedAt)}</p>
        </div>
      ))}
      {assignments.length == 0 && <div className="w:100pc h:calc(100pc-48px) dp:flx flxd:col ai,jc:c">
        <Icon className="m-b:36px w,h:80px" type="clik" icon="clipboard-check" />
        <h2 className="m-b:12px">No activity yet</h2>
        <p>Please come back later to get more info.</p>
      </div>}
    </div>
  </div>
}

const Row = ({ data, icon }) => {
  return <div className="dp:flx ai:c">
    <span className="dp:flx ai,jc:c ta:c h:40px w:20px c:blacka4 fs:125pc"><Icon icon={icon} /></span>
    <span className="m-l:16px">{data || 'N/A'}</span>
  </div>
}

const Label = ({label, data, bold = false}) => {
  const boldStyle = bold ? 'fw:700 fs:125pc' : ''
  return <div className="ta:l m-b:16px">
    <p className="c:blacka4 m-b:4px fs:70pc">{label}</p>
    <p className={`${boldStyle}`}>{data}</p>
  </div>
}

export default User