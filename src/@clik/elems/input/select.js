import { fucss } from 'next-fucss/utils'
import { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollable } from '../../elems/styles'

export default class extends Component {
  render() {
    const { placeholder, name, options, action, centered, bordered, lightgray, classNameInput, label, focus, handleFocus, handleFilter, clearable, filter, light, full, underline, invalid } = this.props

    const val = this.props.value

    let isNull = (!val || !val.length) && (typeof document !== 'undefined' && typeof document.getElementsByName(name)[0] !== 'undefined' && document.getElementsByName(name)[0].value === '')

    return [
      <form key={val + '_input'} autoComplete="off">
        <input
          autoComplete="off"
          type="text"
          placeholder={placeholder}
          onBlur={handleBlur(handleFocus)}
          onKeyUp={handleFilter}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              e.preventDefault()
              e.stopPropagation()
              handleFocus()
              action && action(e, this.props)
            }
          }}
          required
          id={label}
          name={name}
          autoFocus={focus}
          onFocus={e => !focus && handleFocus(true)}
          defaultValue={val}
          className={classNameInput(underline, invalid, centered, bordered, lightgray)}
        />
        {val && clearable && (
          <span onClick={() => clearInput(action, name)} className={classNameClear(isNull, light)}>
            <FontAwesomeIcon icon="times-circle" />
          </span>
        )}
      </form>,

      <Scrollable key={val + '_field'} className={classNameOptionContainer(focus)}>
        <div className={classNameSelectBox(options && options.length && focus)}>
          {options &&
            options
              .filter(opt => (filter && filter.length && filter !== val ? (opt.text || opt.value || opt).toLowerCase().includes(filter.toLowerCase()) : true))
              .map(opt => {
                const text = opt.text || opt.value || opt
                const value = opt.value || opt

                return (
                  <span
                    onClick={e => action && action(value)}
                    // className={classNameOption(opt.active || val === value, opt.full || full)}
                    className={classNameOption(val === value)}
                    key={value + '_val'}
                    data={opt && opt.data}
                    value={value}>
                    {text}
                  </span>
                )
              })}
        </div>
      </Scrollable>
    ]
  }
}

const clearInput = (action, name) => {
  if (typeof document !== 'undefined') {
    document.getElementsByName(name)[0].value = ''
    action('')
  }
}

const classNameSelectBox = focus =>
  fucss({
    'dp:n': true,
    'dp:n': !focus,
    'dp:bk': focus
  })

const classNameClear = (isNull, light) =>
  fucss({
    'ps:ab r:5px crs:pt p:9px ws:np lh:1 ts:all w:30px': true,
    'op:0 w:0': isNull,
    'c:sec': light
  })

function handleBlur(handleFocus) {
  return e => setTimeout(() => handleFocus(false), 200)
}

const classNameOptionContainer = focus =>
  fucss({
    'mxh:0 dp:n': !focus,
    'mxh:180px': focus,
    'ps:ab t:100pc m-t:1npx sh:0-1px-3px-000a15 bg:white p:20px-15px-10px w:100pc mxw:200px z:1 bd-t:1px-sd-ccc of:auto': true
  })

const classNameOption = active =>
  fucss({
    'w:100pc p:7px-15px crs:pt fw:400 m-b:10px hv-bg:prim hv-c:white br:5px': true,
    'bg:prim c:white': active,
    'bg:f5f5f5 c:black': !active
  })

export const selectDefault = ({ placeholder, name, options, width, value, action, setId }) => {
  value = (options && !!options.find(opt => opt === value || opt.value === value) && value) || false
  return (
    <select name={name} defaultValue={value || false} onChange={action} setid={setId} key={value} className={classNameSelect(!!value)} style={{ width: !width ? '100%' : width, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}>
      {placeholder && (
        <option disabled value={false}>
          {placeholder}
        </option>
      )}
      {options &&
        options.map(opt => {
          const text = opt.text || opt.value || opt
          const value = opt.value || opt
          return (
            <option key={value} data={opt && opt.data} value={value}>
              {text}
            </option>
          )
        })}
    </select>
  )
}

const classNameSelect = value =>
  fucss({
    'bg:white br:5px m:5px p:10px bd-c:grey200 bd-w:1px fc-bs:1_bd-c:prim_scl:1.05 ts:all': true,
    'c:grey': !value
  })
