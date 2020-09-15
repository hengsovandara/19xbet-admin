import Link from 'next/link'
import { fucss } from 'next-fucss/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SearchButton = ({ children, ...props }) => <button {...props}>{children}</button>

export default props => {
  if (props.type === 'file') return <ElemInput {...props} />

  return props.href ? (
    <Link passHref href={props.href}>
      <a className={fucss({ 'dp:bk': props.full })}> {!props.link ? <ElemButton {...props} /> : <ElemLink {...props} />} </a>
    </Link>
  ) : props.link ? (
    <ElemLink {...props} />
  ) : (
    <ElemButton {...props} />
  )
}

function ElemInput(props) {
  const { name, icon, className, action, onClick, text, disabled, children, bordered, iconEnd, single, accept } = props
  return (
    
      <label className={classNameButton(props) + ' ' + className}>
        {!iconEnd && icon && <FontAwesomeIcon icon={icon} size={bordered && '2x'} className={classNameIcon(props)} />}
        {icon && bordered && <br />}
        {text || name || children}
        {iconEnd && icon && <FontAwesomeIcon icon={icon} size={bordered && '2x'} className={classNameIcon(props)} />}
        <input id="images" type="file" accept={accept ? accept : 'image/*, image/png, image/jpeg; capture=camcorder'} multiple={!single} className="dp:n" onChange={e => action && action(single ? e.target.files[0] : e.target.files)} />
      </label>
    
  )
}

function ElemLink({ href, link, tiny, color, className, children, name, text, icon, iconEnd, action, light }) {
  return (
    <span onClick={action || null} className={classNameLink(tiny, color, light) + ' ' + className}>
      {!iconEnd && icon && <FontAwesomeIcon icon={icon} className={fucss({ 'm-r:8px': name || text || children })} />}
      {children || name || text}
      {iconEnd && icon && <FontAwesomeIcon icon={icon} className={fucss({ 'm-r:8px': name || text || children })} />}
    </span>
  )
}

function ElemButton(props) {
  const { name, icon, className, action, onClick, text, disabled, children, bordered, iconEnd } = props
  return (
    <button onClick={(!disabled && (onClick || action)) || null} className={classNameButton(props) + ' ' + className}>
      {!iconEnd && icon && <FontAwesomeIcon icon={icon} size={bordered && '2x'} className={classNameIcon(props)} />}
      {icon && bordered && <br />}
      {text || name || children}
      {iconEnd && icon && <FontAwesomeIcon icon={icon} size={bordered && '2x'} className={classNameIcon(props)} />}
    </button>
  )
}

const classNameIcon = ({ text, name, children, bordered, iconEnd, tiny, small }) =>
  fucss({
    'm-r:8px': !iconEnd && (name || text || children) && !bordered,
    'm-l:8px': iconEnd && (name || text || children) && !bordered,
    'md-m-b:10px': bordered,
    'h,w,lh:20px': !tiny && !small
  })

const classNameLink = (tiny, color, light) =>
  fucss({
    'fw:400 w:100pc crs:pt': true,
    'fs:85pc': tiny,
    'td:ul': !tiny,
    'c:prim300': !color,
    'c:green': color === 'green',
    'c:yellow800': color === 'yellow',
    'c:red400': color === 'red',
    'c:sec': color === 'sec'
  })

const classNameButton = ({ color, full, small, tiny, circle, disabled, icon, bordered, light }) =>
  fucss({
    'ta:c fw:400 ws:np crs:pt bs:1 hv-try:1px ts:all': true,
    'dp:flx ai:c': icon && !bordered,
    'br:5px': !circle,
    'w,h,lh:50px br:50pc bs:2': circle,
    'p:6px-12px': tiny && !circle && (!bordered || (bordered && !icon)),
    'p:10px-20px': !small && !circle && (!bordered || (bordered && !icon)),
    'p:7px-15px': small && !circle && (!bordered || (bordered && !icon)),
    'w:100pc': full !== undefined && !circle,
    'bg:prim': 'prim',
    'bg:green': color === 'green',
    'bg:yellow800': color === 'yellow',
    'bg:red300': color === 'red',
    'bg:sec': color === 'sec',
    'bg:tert': color === 'tert',
    'bg:ts c:white': color === 'none' && !light,
    'bg:ts c:sec300': color === 'none' && light,
    'c:white': color !== 'white',
    'bg:white c:sec400': color === 'white',
    'bg:ts': color === 'transparent',
    'op:0.8 bg:grey300-! bd-c:grey600-! crs:n': disabled,
    'fs:90pc': small || !small,
    'fs:80pc lh:1': tiny,
    'bd-w:1px hv-bg:white_bs:2_c:prim': bordered,
    'md-p:20px mdx-p:10px': bordered && icon
  })
