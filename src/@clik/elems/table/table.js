import { fucss } from 'next-fucss/utils'
import Link from 'next/link'
import Checkbox from './checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
  const { selected, light, data } = props

  return (
    <div className="w:100pc bd-b:1px-sld-grey200">
      <div className={classNameWrapper(props.maxHeight)}>
        <div className={classNameContainer(light)}>
          {!props.noHead && props.fields && (
            <div className="dp:tr tt:uc fs:70pc mdx-dp:n bd-t:1px-sd-e8e8e8">
              {props.allowSelect && (
                <div key="selectBox" title="Select item to delete" className="fw:600 p:10px dp:td va:m">
                  <Checkbox onSelect={e => props.onSelect(data.map(item => item.id), selected.length >= data.length * 0.8)} isChecked={selected && selected.length >= data.length * 0.8} />
                </div>
              )}
              {props.fields.map(field => {
                const isSortable = props.sortable && props.sortable.includes(field)
                return (
                  <div key={field} title={(isSortable && `Sort by ${field}`) || ''} className={classNameField(isSortable)} onClick={() => isSortable && props.action && props.action(field, { name: 'sort' })}>
                    {field}
                    {props.sort && props.sort === field && <FontAwesomeIcon icon="sort-amount-up" className="m-l:5px" />}
                  </div>
                )
              })}
            </div>
          )}
          {data.map((item, i) =>
            item._href ? (
              <Link key={i + '_tbody_link'} href={item._href}>
                <div className={classNameRow(item._options || {}, light, props.space) + ` table-row-${i}`}>
                  {props.allowSelect && (
                    <div className={classNameData({ center: true }, i % 2, light)}>
                      <Checkbox onSelect={e => props.onSelect(item.id, selected && selected.includes(item.id))} isChecked={selected && selected.includes(item.id)} />
                    </div>
                  )}
                  <Item item={item} i={i} fields={props.fields} light={light} />
                </div>
              </Link>
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
          )}
        </div>
      </div>
    </div>
  )
}

const classNameField = sortable =>
  fucss({
    'fw:600 p:10px op:0.8 dp:td va:m ws:np': true,
    'crs:pt hv-c:prim ts:all': sortable
  })

const classNameWrapper = maxHeight =>
  fucss({
    'bz:cbx mxh:calc(100vh-300px) of-y:scroll p-r:27px w:100pc': maxHeight
  })

const classNameContainer = (light, maxHeight) =>
  fucss({
    'w:100pc dp:tb bd-clp:clp m:0 ps:rl': true,
    'c:whitea8': !light,
    'c:sec bg:white': light
  })

const classNameData = ({ isGreen, isYellow, color, bold, mobile = true, center, nospace, type, noborder }, isOdd, light) =>
  fucss({
    'ta:l': !center,
    'va:m dp:td ps:rl': true,
    'bd-w:1px bd-c:blacka1': !noborder && !light,
    'bd-t-w:1px bd-c:greya2': !noborder && light,
    'p:12px-10px': !nospace,
    'c:green': color === 'green',
    'c:orange': color === 'orange',
    'c:red': color === 'red',
    'fw:600': bold,
    'mdx-dp:n': !mobile,
    'bg:blacka1': !isOdd && !light,
    'ta:c': center,
    'op:0.7 fs:80pc': type === 'label'
  })

const classNameRow = ({ noHover, big }, light, space) =>
  fucss({
    'dp:tr ts:bg': true,
    'bd-b:10px-solid-sec600': space,
    'hv-bg:sec600 crs:pt': !noHover && !light,
    'hv-bs:2 crs:pt': !noHover && light,
    'fs:80pc': !big
  })

function Item({ item, fields, i, light }) {
  return fields.map(key => {
    const value = item[key]
    return (
      <div key={key + '_tbody'} className={classNameData(!value ? {} : value, i % 2, light)}>
        <div></div>
        {value && getValue(value)}
        {value && value.title && <span className="fw:700 md-fs:130pc m:0 p:0">{value.title}</span>}
        {value && value.subValue && (
          <small>
            <br />
            {value.subValue}
          </small>
        )}
        {value && value.component && <value.component {...value.props} light={light} test={value.props} />}
      </div>
    )
  })
}

function getValue(value) {
  return value && typeof value === 'object' ? value.value : value
}
