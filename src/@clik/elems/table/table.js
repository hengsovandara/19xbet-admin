import { fucss } from 'next-fucss/utils'
import Link from 'next/link'
import Checkbox from './checkbox'
import Icon from '../icon'
import { useRouter } from 'next/router'

const Table = props => {
  const router = useRouter()
  const { selected, light, data, leftHead = false, onClickRow } = props

  const onClick = async (e, item) => {
    e.preventDefault()
    if(!onClickRow) return router.push(item._href)
    const error = await onClickRow(item)
    !error && router.push(item._href)
  }

  return (
    <div className={data && "w:100pc of:hd of-x:auto bd-b:1px-sld-grey200"}>
      <div className={classNameWrapper(props.maxHeight)}>
        <div className={classNameContainer(light)}>
          {!props.noHead && props.fields && data.length > 0 && (
            <div className="dp:tr tt:uc fs:70pc mdx-dp:n bd-t:1px-sd-blacka12">
              {props.allowSelect && (
                <div key="selectBox" title="Select item to delete" className="fw:600 p:12px dp:td va:m w:44px">
                  <Checkbox onSelect={e => props.onSelect(data.map(item => item.id), selected.length >= data.length * 0.8)} isChecked={selected && selected.length >= data.length * 0.8} />
                </div>
              )}
              {props.fields.map(field => {
                const isSortable = props.sortable && props.sortable.includes(field)
                return (
                  <div key={field} title={(isSortable && `Sort by ${field}`) || ''} className={classNameField(isSortable, leftHead)} onClick={() => isSortable && props.action && props.action(field, { name: 'sort' })}>
                    {field}
                    {props.sort && props.sort === field && <Icon icon="sort-amount-up" className="m-l:5px" />}
                  </div>
                )
              })}
            </div>
          )}
          {data.map((item, i) => {
            return item._href ? (
              // <Link key={i + '_tbody_link'} onClick={e => onClick(e, item)} href={item._href} scroll={item._href?.scroll}>
              <div onClick={e => onClick(e, item)} key={i + '_tbody_link'} className={classNameRow(item._options || {}, light, props.space) + ` table-row-${i}`}>
                {props.allowSelect && (
                  <div className={classNameData({ center: true }, i % 2, light, props.checkbox)}>
                    <Checkbox onSelect={e => props.onSelect(item.id, selected && selected.includes(item.id))} isChecked={selected && selected.includes(item.id)} />
                  </div>
                )}
                <Item item={item} i={i} fields={props.fields} light={light} />
              </div>
              // </Link>
            ) : (
              <div key={i + '_tbody_data'} className={classNameRow(item._options || {}, light, props.space)}>
                {props.allowSelect && (
                  <div className={classNameData({ center: true }, i % 2, light)}>
                    <Checkbox onSelect={e => props.onSelect(item.id, selected && selected.includes(item.id))} isChecked={selected && selected.includes(item.id)} />
                  </div>
                )}
                <Item item={item} i={i} fields={props.fields} light={light} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Table

const classNameField = (sortable, left=false) =>
  fucss({
    'fw:600 p:12px dp:td va:m ws:np c:blacka5': true,
    'crs:pt hv-c:prim ts:all': sortable,
    'ta:l': left
  })

const classNameWrapper = maxHeight =>
  fucss({
    'bz:cbx mxh:calc(100vh-300px) of-y:scroll p-r:27px w:100pc': maxHeight
  })

const classNameContainer = (light, maxHeight) =>
  fucss({
    'w:100pc dp:tb bd-clp:clp m:0 ps:rl': true,
    'c:whitea8': !light,
    'c:black300 bg:white': light
  })

const classNameData = ({ color, bold, mobile = true, center, checkbox, nospace, type, noborder }, isOdd, light) =>
  fucss({
    'ta:l': !center,
    'w:44px': checkbox,
    'va:m dp:td ps:rl mnw:120px': true,
    'bd-w:1px bd-c:blacka12': !noborder && !light,
    'bd-t-w:1px bd-c:greya2': !noborder && light,
    'p:16px-12px': !nospace,
    'c:green': color === 'green',
    'c:orange': color === 'orange',
    'c:red': color === 'red',
    'fw:600': bold,
    'mdx-dp:n': !mobile,
    'bg:seca02': !isOdd && light,
    'ta:c': center,
    'fs:100pc': type === 'label'
  })

const classNameRow = ({ noHover, big, selected, extraStyles = {} }, isOdd, light, space) =>
  fucss({
    'dp:tr ts:bg': true,
    'bg:seca02': !isOdd && light,
    'bd-b:12px-solid-sec600': space,
    'hv-bg:prima05 crs:pt': !noHover && !light,
    'hv-bs:2 hv-bg:prima05 crs:pt': !noHover && light,
    'bs:2': selected,
    'fs:100pc': !big,
    'fs:125pc': big,
    ...extraStyles
  })

// broken image backup
function brokenImageBackup(ev){
  ev.target.src = 'https://i.imgur.com/Ut4LRBn.png'
}

function Item({ item, fields, i, light }) {
  return fields.map(key => {
    const value = item[key]
    return (
      <div key={key + '_tbody'} className={classNameData(!value ? {} : value, i % 2, light)}>
        <div className={"dp:flx" + (value.center ? ' jc:c' : '')}>
          <p className={(value.color ? `jc:${value.color}` : '')}>{value && getValue(value)}</p>
          {value && value.url &&
            <div className="br:50pc dp:flx jc:c ai:c w,h,mnw:40px ts:all m-r:16px">
              {value.url
                ? <img src={value.url} onError={brokenImageBackup} className="br:50pc w,h:100pc" />
                : <Icon icon="user" />
              }
            </div>
          }
          <div>
            {value && value.title &&
              <span className="fw:bold c:black">
                {value.title?.name || value.title}
                {value.title?.component && <value.title.component {...value.props} light={light} test={value.props} /> }
              </span>}
            {value && value.subValue && (
              <small className="c:black100">
                <br />
                {value.subValue}
              </small>
            )}
          </div>
        </div>
        {value && value.component && <value.component {...value.props} light={light} test={value.props} />}
      </div>
    )
  })
}

function getValue(value) {
  return value && typeof value === 'object' ? value.value : value
}
