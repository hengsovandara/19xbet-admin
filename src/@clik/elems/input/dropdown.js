import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

let timer

export default props => {
  const { date, focus, confirmable, clearable, noWrapper, classNameInput, underline, invalid } = props
  const value = props.val || props.value

  timer && focus && clearTimeout(timer)

  return [
    <form key="input" autoComplete="off">
      <input
        key={value}
        autoComplete="off"
        type="text"
        placeholder={props.placeholder}
        onFocus={e => !focus && props.handleFocus(true)}
        required
        id={props.label}
        autoFocus={focus}
        defaultValue={value}
        className={classNameInput(underline, invalid)}
      />
    </form>,
    true && (
      <div key="children" className={classNameDropdown(focus, noWrapper)}>
        {props.children}
      </div>
    )
  ]
}

function handleBlur(e, handleFocus, value) {
  timer = setTimeout(() => {
    handleFocus()
  }, 400)
}

const classNameConfirm = (value, light) =>
  fucss({
    'crs:pt p:10px-5px br:50pc ws:np lh:1 ts:all w:25px': true,
    'c:sec': light,
    'op:0 w:0': !value
  })

const classNameDropdown = (focus, noWrapper) =>
  fucss({
    'mxh:0': !focus,
    'ps:ab l:0 t:100pc m-t:1npx sh:0-1px-3px-000a15 bg:white w:150pc mxw:200px z:1 bd-t:1px-sd-ccc': focus
  })
