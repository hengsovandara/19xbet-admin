import { fucss } from 'next-fucss/utils'
import Form from '../form'

export default props => {
  const { action, type, options, name, value, width, color, setId, details, wrap, label, ids, extractionAction, light } = props
  if (!options) return <span>Empty Checkbox</span>

  return options.map((opt, i) => {
    const optValue = value && value.find ? value.find(item => item[opt.name] === opt.value) : value && value[opt.name] === opt.value

    // opt.fields && optValue && console.log('value', value instanceof Array ? optValue : value);
    const optProps = {
      ...props,
      ...opt,
      value: props.value,
      ids: optValue && optValue.id ? Array.from(ids).concat([optValue.id]) : ids
    }

    return (
      <span key={i} className="p:5px w:100pc" style={{ color: !optValue ? color : 'white', width: !optValue && (opt.width || width) }}>
        <div className={classNameContainer(opt.wrap, opt.fields, optValue, opt.width, opt.light || light)}>
          <label className={classNameCheckbox(!!optValue, !!opt.fields, !!opt.wrap, opt.width, opt.light || light)}>
            <input onClick={opt.action || extractionAction(optProps)} className="ps:ab h,w:0 op:0" type={type} id={opt.value} setid={(optValue && optValue.id) || setId} name={name} value={opt.value} />
            {opt.text || opt.value}
          </label>

          {!!optValue && !!opt.fields && <Form ids={ids} action={opt.action || action} light={opt.light || light} fields={opt.fields} noWrapper={!opt.wrap} color={color} noSpace={true} data={value instanceof Array ? optValue : value} />}
        </div>
      </span>
    )
  })
}

// const classNameWrapper = (wrap, fields, optValue) => fucss({
//   'p:5px': true
// });

const classNameContainer = (wrap, fields, optValue, width, light) =>
  fucss({
    'w:100pc-!': !!optValue && !!fields,
    'w:100pc ts:all mdx-w:100pc-! br:5px': true,
    'dp:flx mdx-flxw:wrap': width,
    'bg:sec600 bd:1px-sld-sec400': !light,
    'bg:grey100 bd:1px-sld-grey200': light
  })

const classNameCheckbox = (active, fields, wrap, width, light) =>
  fucss({
    'p:7px-14px br:5px-0-0-3px bs:1 bd:0 fl:r fw:600 hv-bs:2 ts:all c:white ws:np mnw:150px mdx-w:100pc-! crs:pt dp:flx ai:c jc:c': true,
    'w:100pc': !(active && fields) || wrap,
    'md-m-r:0 m:5px': active && fields,
    'bg:prim': active && fields && !light,
    'bg:sec300': active && fields && light,
    'bg:tert': !active && !light,
    'bg:white c:sec300': !active && light,
    'w:calc(100pc-10px) m-r:5px-!': !width && active,
    'bd-b:1px-sld-tert600': !light
  })

//style={{ backgroundColor: (!optValue) ? 'white' : color, color: (!optValue) ? color : 'white' }}
