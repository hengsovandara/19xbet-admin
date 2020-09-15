import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

let timer
// let initialRender = true;
let isSearching = false

export default props => {
  const { centered, label, focus, bordered, name, type, value, placeholder, className, classNameInput, confirmable, prefix, width, live, clearable } = props

  let isNull = typeof document !== 'undefined' && typeof document.getElementsByName(name)[0] !== 'undefined' && document.getElementsByName(name)[0].value === ''

  if (bordered)
    return (
      <span className={'dp:bk m-b:15px ' + className}>
        <label htmlFor={name} className="c:grey200 dp:bk ta:l fw:600 fs:90pc m-b:3px">
          {label}
        </label>
        <form autoComplete="off">
          <input defaultValue={value} name={name} id={name} placeholder={placeholder} type={type} className="c:white bg:ts br:5px p:10px m-tb:5px bd-c:silver600 bd-w:1px w:100pc fc-bs:1_bd-c:prim300_scl:1.02 ts:all" />
        </form>
      </span>
    )

  if (clearable && !confirmable)
    return (
      <div key={value} className="dp:flx w:100pc">
        <Input {...props} focus={isSearching === false ? isSearching : !isNull} />
        <span onClick={() => clearInput(props.action, props.name)} className={classNameClear(isNull || !isSearching, props.light)}>
          <FontAwesomeIcon icon="times-circle" />
        </span>
      </div>
    )

  if (confirmable)
    return (
      <div key={value} className="dp:flx w:100pc">
        <Input {...props} />
        {confirmable && (
          <span onClick={e => props.handleFocus() && props.action(e)} className={classNameConfirm(focus && (!isNull || props.allowEmpty), props.light, clearable && value && value.length)}>
            <FontAwesomeIcon icon="check-circle" />
          </span>
        )}
        {clearable && (value && value.length) && (
          <span onClick={e => props.handleFocus() && props.action('')} className={classNameConfirm(true, props.light)}>
            <FontAwesomeIcon icon="times-circle" />
          </span>
        )}
      </div>
    )

  return !prefix ? (
    <Input {...props} />
  ) : (
    <div key={value} className="dp:flx w:100pc">
      <span className={classNamePrefix(props.light)}>{prefix}</span>
      <Input {...props} />
    </div>
  )
}

const clearInput = (action, name) => {
  if (typeof document !== 'undefined') {
    document.getElementsByName(name)[0].value = ''
    isSearching = false
    action('')
  }
}

const doneTyping = (action, ms) => e => {
  e.persist()
  clearTimeout(timer)
  isSearching = true
  timer = setTimeout(() => {
    action(e)
  }, ms)
}

const classNamePrefix = light =>
  fucss({
    'br:5px c:white fw:600 p:10px ws:np lh:1 m-r:10px': true,
    'bg:sec300': !light,
    'bg:grey100 c:sec300 bd:1px-sld-grey200 bd-w-r:0': light
  })

const classNameConfirm = (value, light, multiple) =>
  fucss({
    'ps:ab crs:pt p:8px ws:np ts:all w:30px': true,
    'op:0 w:0': !value,
    'r:3px': !multiple,
    'r:25px': multiple,
    'c:sec': light
  })

const classNameClear = (isNull, light) =>
  fucss({
    'ps:ab r:6px crs:pt p:9px ws:np ts:all w:30px': true,
    'op:0 w:0': isNull,
    'c:sec': light
  })

const Input = props => {
  const { active, label, light, lightgray, underline, background, invalid, centered } = props;
  return (
    <form autoComplete="off" className="w:100pc">
      <input
        onKeyUp={(props.live && doneTyping(props.action, props.live || 1000)) || null}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault()
            e.stopPropagation()
            props.action && props.action(e)
          }
        }}
        required
        autoFocus={props.focus}
        onClick={props.handleFocus}
        onBlur={e => (props.handleFocus() && props.action(e)) || null}
        onChange={props.handleValueChange}
        size={props.size}
        defaultValue={props.value}
        placeholder={props.placeholder}
        id={props.label}
        name={props.name}
        type={props.type}
        className={props.classNameInput(underline, invalid, centered, background, lightgray)}
        autoComplete="off"
      />
    </form>
  )
}

const onEnterKeyPressed = (e, props) => {
  if (e.keyCode == 13)
    if (props.confirmable) props.action(e)
    else return e.keyCode !== 13
}
