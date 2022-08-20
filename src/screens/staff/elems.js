import { ElemPopup } from 'clik/comps/fillers'
import Button from 'clik/elems/button'
import Form from 'clik/elems/form'

export const UserForm = ({ type, title, action, data, onClose, onSubmit, loginUser, roles = [] }) => {
  const fields = getFields(type, data, roles, loginUser)

  return <ElemPopup onClose={onClose}>
    <div className="w:100pc">
      <div className="bg:fff w:400px br:8px p:24px p-t:36px dp:flx fd:col">
        <h2 className="m-b:36px">{title}</h2>
        <div className="m-b:24px">
          <Form
            fields={fields}
            action={action}
          />
        </div>
        <div className="w:100pc dp:flx ai:c jc:fe">
          <Button text="Cancel" simple action={onClose} />
          <Button bordered prim text="Done" action={onSubmit} />
        </div>
      </div>
    </div>
  </ElemPopup>
}

function getFields(type, data, roles, loginUser) {
  if(type === 'user') {
    roles = [{ value: "admin"}]
    const disabledRole = ['associate', 'compliance'].includes(loginUser.role)
    return [
      { disabled: disabledRole, name: 'role', altValue: data.role, allowEmpty: true, label: 'Role', placeholder: 'Select role', options: [{ value: "admin"}], type: 'select', lightgray: true, width: '100%', className: 'm-b:24px' },
      { name: 'name', altValue: data.name, allowEmpty: true, label: 'Name', placeholder: 'Enter name', type: 'text', lightgray: true, light: true, width: '100%', className: 'm-b:24px' },
      { name: 'email', altValue: data.email, allowEmpty: true, label: 'Email', placeholder: 'Enter email', type: 'text', lightgray: true, width: '100%', light: true, className: 'm-b:24px' },
      { name: 'phoneNumber', altValue: data.phoneNumber, allowEmpty: true, label: 'Phone Number', placeholder: 'Enter phone number', type: 'text', lightgray: true, width: '100%',  light: true, className: 'm-b:24px' },
      { name: 'pin', label: 'Pin', allowEmpty: false, placeholder: 'Staf Pin', type: 'text', lightgray: true, width: '100%', light: true },
    ]
  } else if(type === 'changePin') {
    return [
      { name: 'oldPin', allowEmpty: true, placeholder: 'Old Pin', type: 'text', lightgray: true, light: true, width: '100%', className: 'm-b:24px' },
      { name: 'newPin', allowEmpty: true, placeholder: 'New Pin', type: 'text', lightgray: true, width: '100%', light: true },
    ]
  }
}

export const Confirmation = ({ title, subText, onDone, onClose}) => {
  return <ElemPopup onClose={onClose}>
      <div className="bg:white br:8px p:24px p-t:36px dp:flx fd:col ai:c jc:sb m:auto">
        <h2 className="m-b:24px">{title}</h2>
        <p className="m-b:36px">{subText}</p>
        <div className="w:100pc dp:flx jc:sb">
          <Button className="w:calc(50pc-8px) m-r:8px" bordered prim text="Yes" action={onDone} />
          <Button className="w:calc(50pc-8px) m-l:8px" bordered alert text="No" action={onClose} />
        </div>
      </div>
  </ElemPopup>
}