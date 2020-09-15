import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

export default props => {
  const action = props.addNote || props.action || props.handleFocus
  // console.log(action);
  return (
    <div className={classNameContainer(props)}>
      <textarea onClick={props.handleFocus} name={props.name} rows={props.row} placeholder={props.placeholder} className={classNameText(props)} onBlur={e => props.handleFocus(false) && action(e)} />

      {props.children
        ? props.children
        : props.focus && (
            <span className="ps:ab b:0 r:0 p:12px-15px crs:pt br:5px bs:1 bg:white c:sec">
              <FontAwesomeIcon icon="check" />
            </span>
          )}
    </div>
  )
}

const classNameContainer = ({ light }) =>
  fucss({
    'ps:rl p:5px br:5px': true,
    'bg:sec': !light,
    'bg:white': light
  })

const classNameText = ({ light, deep }) =>
  fucss({
    'm:0 dp:bk fs:100pc w:100pc br:5px p:15px ff:inh': true,
    'c:white bg:tert ls:1px bd:1px-solid-sec': !light,
    'bg:grey100 bd:1px-sld-grey200': deep
  })