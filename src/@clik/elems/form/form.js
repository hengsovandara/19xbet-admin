import Input from '../input'
import { fucss } from 'next-fucss/utils'
import { Fragment } from 'react'
import Label from '../input/label'

export default function Form(props) {
  const { fields, noSpace } = props

  // console.log(noSpace && {props});

  return (
    <div className={classNameWrapper(props)}>
      {fields.map((field, i) => (
        <Field {...props} {...field} {...getExtraProps(props, field)} key={i} fields={field.fields} label={field.label} noSpace={noSpace || field.noSpace} />
      ))}
    </div>
  )
}

const Field = props => {
  const { name, type, fields, label, light, edit } = props
  // fields && console.log({fields})
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
  // let value = data && data[field.name] || data[name];
  let value = data && field.name ? data[field.name] : name && data[name]
  const id = (value && value.id) || (data && data.id)

  if (id && !~ids.indexOf(id)) ids = Array.from(ids).concat(id)

  // if(value)
  //   value = typeof value === 'object' && !Object.keys(value).length

  // console.log({value, name: field.name || name })

  return { ids, value, data: value || data }
}

const ElemLabel = props => <label className={classNameLabel(props)}>{props.label}</label>

const classNameLabel = ({ label, light }) =>
  fucss({
    'dp:bk ta:l w:100pc m:5px-0-0-5px': true,
    'fs:90pc c:grey200': !light,
    'c:sec300 fs:80pc fw:600': light
  })

const classNameWrapper = ({ wrap, noSpace }) =>
  fucss({
    'md-dp:flx w:100pc flxw:wrap ai:c': true,
    // 'flxw:wrap': !!wrap,
    'md-jc:sb': wrap === 'space',
    'md-jc:fs': wrap === 'start'
    // 'p-b:20px': !noSpace
  })
