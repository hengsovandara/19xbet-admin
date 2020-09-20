import { fucss } from 'next-fucss/utils'
import { Fragment } from 'react'

export default props => {
  const { placeholder, name, options, width, action, ids, extractionAction, light } = props

  let value = props.value
  value = (options && !!options.find(opt => opt === value || opt.value === value) && value) || false

  const hasValue = props.value && !value

  return (
    <Fragment>
      {' '}
      {options.map(opt => {
        const optValue = value && value.find ? value.find(item => item[opt.name] === opt.value) : value && value[opt.name] === opt.value

        const checked = String(opt.value) === String(value)
        const optProps = {
          ...props,
          ...opt,
          value: props.value,
          ids: optValue && optValue.id ? Array.from(ids).concat([optValue.id]) : ids
        }

        return (
          <span key={opt.value}>
            <input className="w,h:0 op:0 ps:ab" onChange={e => opt.action || extractionAction(optProps)(opt.value)} type="radio" id={String(opt.value)} name={name} value={opt.value} checked={checked} />
            <label className={classNameOption(checked, light)} htmlFor={String(opt.value)}>
              <span className={classNameCheck(checked, light)} />
              {opt.text || opt.value || opt}
            </label>
          </span>
        )
      })}
      {hasValue && (
        <span key={props.value}>
          <input className="w,h:0 op:0 ps:ab" type="radio" id={String(props.value)} name={name} value={props.value} checked={true} />
          <label className={classNameOption(true, light)} htmlFor={String(props.value)}>
            <span className={classNameCheck(true, light)} />${Number(parseFloat(props.value).toFixed(2)).toLocaleString('en')}
          </label>
        </span>
      )}
    </Fragment>
  )
}

const classNameOption = (checked, light) =>
  fucss({
    'p:7px-16px br:5px m:0-5px-5px-0 fw:600': true,
    'bg:tert': !light,
    'c:sec300': checked && light,
    'c:grey300': !checked && light,
    'bg:grey100 bd:1px-sld-grey200': light
  })

const classNameCheck = (checked, light) =>
  fucss({
    'br:50pc w,h,lh:11px m:0-5px-5px-0': true,
    'bg:prim': checked && !light,
    'bg:sec600': !checked && !light,
    'bg:grey300': !checked && light,
    'bg:sec300': checked && light
  })
