import { fucss } from 'next-fucss/utils'
import { Component } from 'react'
import { Transition } from 'react-spring'
import Select from './select'
import Button from '../button'
import Radio from './radio'
import Checkbox from './checkbox'
import Text from './text'
import File from './file'
import Users from './users'
import Range from './range'
import Dropdown from './dropdown'
import Textfield from './textfield'
import Label from './label'

export default class extends Component {
  render() {
    if (this.props.bordered) return <Text {...this.props} />

    if (!this.props.type) return null

    const { width, label, className, type, value, sep, valueLabel, noWrapper, noSpace, light } = this.props
    const { focus, size } = this.state

    const edit = this.props.edit !== undefined ? this.props.edit : this.state.edit

    return (
      <div className={classNameInputWrapper(width, sep, edit, noWrapper, type === 'checkbox', noSpace) + ' ' + (className || '')} style={{ width: edit && width }}>
        {label && (!valueLabel || (valueLabel && !edit && value)) && <Label label={label} {...this.props} />}

        {edit || (type === 'file' && value.length) ? <ElemInput {...this.props} focus={focus} size={size} handleValueChange={this.handleChange} handleToggleEdit={this.handleToggleEdit} handleFocus={this.handleFocus} handleFilter={this.handleFilter} filter={this.state.value} /> : <ElemPreview {...this.props} handleToggleEdit={this.handleToggleEdit} />}
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = this.generateState(props)

    this.handleToggleEdit = this.handleToggleEdit.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFilter = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.getMethods &&
      this.props.getMethods({
        handleToggleEdit: this.handleToggleEdit.bind(this)
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.confirmable) return

    this.setState(this.generateState(nextProps))
  }

  handleToggleEdit(e) {
    this.setState({
      edit: !this.state.edit,
      focus: !this.state.edit
    })
    return true
  }

  handleFocus(focus) {
    const edit = (focus && true) || false
    this.setState({ focus: edit })

    !focus && this.props.value && this.setState({ edit: false })
    return true
  }

  handleChange(e) {
    const value = (typeof e === 'object' && e.target && e.target.value) || e
    this.setState({ value, size: value && String(value).length })
  }

  generateState(props) {
    return {
      edit: this.isEmptyValue(props.value),
      focus: false,
      value: props.value,
      size: props.value && String(props.value).length
    }
  }

  isEmptyValue(value) {
    if (typeof value === 'string' || value instanceof Array) return !value.length

    if (typeof value === 'number') return !String(value).length

    return value === undefined || value === null
  }
}

function ElemInput(props) {
  const { dropdown } = props

  switch (props.type) {
    case 'select':
      return <Select {...props} action={extractValues(props)} classNameInput={classNameInput} filter={props.filter} />
    case 'button':
      return <Button {...props} action={extractValues(props)} />
    case 'file':
      return <File {...props} action={extractValues(props)} classNameInput={classNameInput} />
    case 'text':
    case 'number':
    case 'email':
    case 'password':
      return <Text {...props} action={extractValues(props)} classNameInput={classNameInput} />
    case 'radio':
      return <Radio {...props} extractionAction={extractValues} classNameInput={classNameInput} />
    case 'checkbox':
      return <Checkbox {...props} extractionAction={extractValues} classNameInput={classNameInput} />
    case 'users':
      return <Users {...props} extractionAction={extractValues} classNameInput={classNameInput} />
    case 'textarea':
    case 'textfield':
      return <Textfield separator {...props} action={extractValues(props)} classNameInput={classNameInput} />
    case 'range':
      return dropdown ? (
        <Dropdown {...props} className={classNameInput}>
          {props.focus && <Range {...props} />}
        </Dropdown>
      ) : (
        <Range {...props} classNameInput={classNameInput} />
      )
    default:
      return <span>Missing input type {props.type}</span>
  }
}

function ElemPreview({ prefix, placeholder, sep, handleToggleEdit, value, type, preview, options, toggleable, light }) {
  const isObject = typeof value === 'object' && !(value instanceof Array)
  const multiValue = (value instanceof Array && value.length) || isObject
  const isNested = ~['checkbox'].indexOf(type)

  const allOptions = options && options.reduce((arr, item) => arr.concat(item.fields ? item.fields.reduce((a, field) => a.concat(field.options || []), []) : [item]), [])

  if (multiValue && isNested) {
    if (!preview) return <span>{'specify preview ' + JSON.stringify(value)}</span>

    return (isObject ? [value] : value).map((item, i) => {
      return (
        <span key={i} className="m-r:5px">
          {Object.keys(preview).map(key => {
            const field = preview[key]
            const val = item[field]
            const optValue = options && allOptions.find(opt => opt.value === val)
            const valueText = val !== undefined ? (optValue && optValue.text) || (val && String(val)) : ''

            switch (key) {
              case 'label':
                return (
                  <label key={key} className="p:3px-10px fw:400 fs:90pc c:grey200 bd-w:1px br:5px m:5px">
                    {valueText}
                  </label>
                )
              case 'link':
                const link = val && !~val.indexOf('http') ? '//' + val : val
                return (
                  <a key={key} href={link} target="_blank" className="td:ul fw:600 fs:110pc">
                    {valueText}
                  </a>
                )
              default:
                return (
                  <span key={key} className="fw:400 fs:110pc">
                    {valueText}
                  </span>
                )
            }
          })}
        </span>
      )
    })
  }

  const optValue = options && allOptions.find(opt => opt.value === value)
  const valueText = value !== undefined ? (optValue && optValue.text) || (value && String(value)) : ''

  return (
    <span onClick={handleToggleEdit} className={classNamePreview(valueText, isNested, light)}>
      {prefix && (valueText && prefix + ' ')}
      {valueText || placeholder}
      {sep || ''}
    </span>
  )
}

const classNamePreview = (valueText, isNested, light) =>
  fucss({
    'w:100pc p-tb:10px fw:500 bd-b:1px-sd-ccc c:black': true
  })

const classNameInput = (underline = false, invalid = false, centered = false, background, lightgray) =>
  fucss({
    'w:100pc p-tb:10px fw:500': true,
    'bd-b:2px-sd-green': underline && !invalid,
    'bd-b:2px-sd-red ': underline && invalid,
    'bd-b:2px-sd-ccc': lightgray,
    // 'bd-b-w:1px p:10px br:5px': underline,
    'ta:c': centered,
    'bd:1px-sld-ccca5 c:txt-! br:5px': background
  })

const classNameInputWrapper = (width, sep, edit, noWrapper, isCheckbox, noSpace) =>
  fucss({
    'ps:rl': true,
    '': !sep,
    '': !noWrapper && !isCheckbox && (!sep || edit),
    '': sep && !edit,
    '': isCheckbox,
    '': isCheckbox,
    '': !noSpace
  })

function extractValues(props) {
  if (!props || !props.action) return console.warn('Missing action or extractValues props for action')
  return e => {
    let value

    if (typeof e === 'object' && e.target) {
      const elem = window.document.querySelector(`[name="${props.name}"]`)
      value = e.target.value || (elem && elem.value)
    } else value = e

    if (props && typeof value === 'string' && !value.length) return props.allowEmpty ? props.action(value, props) : console.warn('Empty value', { value })

    if (props && props.type === 'file') {
      props.actionType === 'toggle' && value.id && props.ids.push(value.id)
      value = { url: value }
    }

    if (!props.allowSame && (props && String(props.value) === String(value) && props.type !== 'file')) return console.warn('Same value', { value })

    return props.action(value, props)
  }
}
