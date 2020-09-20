import { fucss } from 'next-fucss/utils'
import { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollable } from '../../elems/styles'

export default class extends Component {
  render() {
    const { placeholder, name, options = [], action, centered, bordered, lightgray, classNameInput, label, focus, handleFocus, handleFilter, clearable, filter, light, underline, invalid, disabled } = this.props

    const val = this.props.altValue || this.props.value

    let isNull = (!val || !val.length) && (typeof document !== 'undefined' && typeof document.getElementsByName(name)[0] !== 'undefined' && document.getElementsByName(name)[0].value === '')
    const selected = options.find(item => (item.value || item.text || item) === val) || {}

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
          disabled={disabled}
          required
          id={label}
          name={name}
          autoFocus={focus}
          onFocus={e => !focus && handleFocus(true)}
          key={`${selected.text || selected.value || ''}_data`}
          defaultValue={selected.text || selected.value || ''}
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
    'ps:ab t:100pc bg:white w:100pc z:1 bd:1px-sd-prim of:auto br:4px bs:3': true
  })

const classNameOption = active =>
  fucss({
    'w:100pc mnh:40px p:4px-12px crs:pt fw:400 hv-bg:prim hv-c:white ta:l ts:all dp:flx ai:c': true,
    'fw:600 c:prim': active,
    'c:black': !active
  })

export const selectDefault = ({ placeholder, name, options, width, value, action, setId, transparent }) => {
  value = (options && !!options.find(opt => opt === value || opt.value === value) && value) || false
  return (
    <select name={name} defaultValue={value || false} onChange={action} setid={setId} key={value} className={classNameSelect(!!value,transparent)} style={{ width: !width ? '100%' : width, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}>
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

const classNameSelect = (value) =>
  fucss({
    'bg:white br:5px m:5px p:12px bd:1px-sd-grey200 bd-w:1px fc-bs:1_bd-c:prim_scl:1.05 ts:all': true,
    'c:grey': !value,
  })
