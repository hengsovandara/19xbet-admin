import { fucss } from 'next-fucss/utils'
import Form from '../form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
  const { type, options, name, value, width, color, setId, details, wrap, label, ids, extractionAction } = props
  if (!options) return <span>Empty Users</span>

  const action = props.onClick || props.action

  return (
    <div className="bg:tert">
      {options.map((opt, i) => (
        <span key={i} onClick={e => action && action(opt.id, { ...props, opt })} className={classNameWrapper(opt.active)}>
          <ElemProfile action={action} {...opt} role={null} />
        </span>
      ))}
    </div>
  )
}

// const classNameWrapper = (wrap, fields, optValue) => fucss({
//   'p:5px': true
// });

const ElemProfile = props => {
  const { name = 'Unknown', photo, role = 'unknown' } = props
  return (
    <span>
      <div className="dp:flx ai:c">
        <span className="w,h,lh:26px ta:c bg:sec600 br:50pc bd:1px-sld-sec700 of:hd p:1px m-r:5px ps:rl">{photo ? <span style={{ backgroundImage: `url(${photo})` }} className="bg-sz:cv bg-ps:c w:100pc h:100pc br:50pc dp:bk" /> : <FontAwesomeIcon icon="user" className="ps:ab crs:pt l,r:0 m-t:3px c:tert" />}</span>
        <span className="fs:90pc">
          <small className="fs:80pc">{role}</small>
          <h4 className="fw:400">{name}</h4>
        </span>
      </div>
    </span>
  )
}

// const classNameContainer = (wrap, fields, optValue) => fucss({
//   'dp:flx mdx-flxw:wrap bg:sec600 w:100pc-! bd:1px-sld-sec400': !!optValue && !!fields,
//   'w:100pc ts:all mdx-w:100pc-! br:5px': true,
// });

const classNameWrapper = active =>
  fucss({
    'p:3px p-r:15px-! br:30px m:3px crs:pt ts:bg': true,
    'bg:sec600': !active,
    'bg:prim': active
  })

//style={{ backgroundColor: (!optValue) ? 'white' : color, color: (!optValue) ? color : 'white' }}
