import Input from '../input'
import { fucss } from 'next-fucss/utils'
import { Fragment } from 'react'
import Label from '../input/label'

export default function Form(props) {
  const { fields, noSpace } = props

  return (
    <div className={classNameWrapper(props)}>
      {fields.map((field, i) => (
        <Field {...props} {...field} {...getExtraProps(props, field)} key={i} fields={field.fields} label={field.label} noSpace={noSpace || field.noSpace} />
      ))}
    </div>
  )
}

const Field = props => {
  const { type, fields, label } = props

  return (
    <Fragment>
      {label && fields && <Label {...props} />}
      {props.component && <props.component {...props} />}
      {type && <Input {...props} />}
      {fields && <Form {...props} />}
    </Fragment>
  )
}

function getExtraProps({ data, name, ids }, field) {
  data = (field && field.data) || data
  let value = data && field.name ? data[field.name] : name && data[name]
  const id = (value && value.id) || (data && data.id)

  if (id && !~ids.indexOf(id)) ids = Array.from(ids).concat(id)

  return { ids, value, data: value || data }
}

const classNameWrapper = ({ wrap, noSpace }) =>
  fucss({
    'md-dp:flx w:100pc flxw:wrap ai:c': true,
    'md-jc:sb': wrap === 'space',
    'md-jc:fs': wrap === 'start'
  })
