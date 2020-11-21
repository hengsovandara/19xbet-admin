import Link from 'next/link'
import { fucss } from 'next-fucss/utils'
import Icon from '../icon'

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
  const { name, icon, className, action, text, disabled, children, iconEnd, single, accept, url } = props
  return (
    <label className={classNameButton(props) + ' ' + className}>
      {!!url && <img src={url} className={classNameImage(false)} />}
      {!url && !iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
      <span className={classNameText()}>{text || name || children}</span>
      {iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
      { !disabled && <input id="images" type="file" accept={accept ? accept : 'image/*, image/png, image/jpeg; capture=camcorder'} multiple={!single} className="dp:n" onChange={e => action && action(single ? e.target.files[0] : e.target.files)} />}
    </label>
  )
}

function ElemLink(props) {
  const { name, icon, className, action, text, children, iconEnd, tiny, color, light } = props
  return (
    <span onClick={action || null} className={classNameLink(tiny, color, light) + ' ' + className}>
      {!iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
      <span className={classNameText()}>{children || name || text}</span>
      {iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
    </span>
  )
}

function ElemButton(props) {
  const { name, icon, className, action, onClick, text, disabled, children, iconEnd } = props
  return (
    <button onClick={(!disabled && (onClick || action)) || null} className={classNameButton(props) + ' ' + className}>
      {!iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
      <span className={classNameText()}>{text || name || children}</span>
      {iconEnd && icon && <span className={classNameIcon(props)}>
        <Icon icon={icon} />
      </span>}
    </button>
  )
}

const classNameImage = light =>
  fucss({
    'h:175px m:5px-5px-0-0 hv-bs:2 ts:all m-b:10px w:500px h:auto': true,
    'bd:1px-sld-grey200': !light
  })

const classNameIcon = ({ text, name, children, bordered, iconEnd, tiny, small, spinIcon }) =>
  fucss({
    'h,w,mnw,lh:40px': true,
    'm-r:8px': !iconEnd && (name || text || children) && !bordered,
    'm-l:8px': iconEnd && (name || text || children) && !bordered,
    'h,w,lh:24px': !tiny && !small,
    'an:spin-2s-linear-infinite': spinIcon
  })

const classNameLink = (tiny, color) =>
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

const classNameText = () => 
  fucss({
    'ta:c w:100pc': true,
  })

const classNameButton = ({ full, small, tiny, circle, disabled, icon, iconEnd, bordered, alert, prim, red, green, simple }) =>
  fucss({
    'dp:flx ai:c ta:c fw:600 ws:np crs:pt ts:all mnh:40px': true,
    'dp:flx ai:c': icon && !bordered,
    'bg:ts': simple,
    'br:5px': !circle,
    'w,h,lh:50px br:50pc': circle,
    'p-rl:12px': tiny && !circle && (!bordered || (bordered && !icon)),
    'p-rl:24px': !icon && !small && !circle && (!bordered || (bordered && !icon)),
    'p-rl:16px': small && !circle && (!bordered || (bordered && !icon)),
    'w:100pc': full && !circle,
    'fs:90pc': small,
    'fs:80pc': tiny,
    'bg:LightCoral c:white': alert,
    'bg:prim c:black': prim,
    'bd:1px-sd-blacka12 bg:ts c:black hv-bd-c:prim_c:prim_bg:prima2': bordered && !alert || bordered && !prim,
    'bd:1px-sd-reda12 bg:ts c:red hv-bd-c:red_c:red_bg:reda2':bordered && red,
    'bd:1px-sd-greena2 bg:ts c:green hv-bd-c:green_c:green_bg:greena2':bordered && green,
    'bd-c:LightCoral-! c:LightCoral-! bg:ts-! hv-bd-c:LightCoral_c:LightCoral_bg:reda2-!':  bordered && alert,
    'bd-c:prim-! c:prim-! bg:ts-! hv-bd-c:prim_c:prim_bg:prima2-!': bordered && prim,
    'op:0.8 bg:blacka12-! bd-c:blacka12-! crs:default c:white-!': disabled,
  })
