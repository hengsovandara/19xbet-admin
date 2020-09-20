import { fucss } from 'next-fucss/utils'

export default ({ type, edit, light, label, children, fields, space, tips, invalid = false }) => (
  <label className={classNameLabel(type === 'checkbox', edit, light, fields, space, invalid)} htmlFor={label}>
    {label || children}
    <span className="ps:ab r,t:0 c:grey300 p-rl:5px m:5px">{tips}</span>
  </label>
)

const classNameLabel = (isCheckbox, edit, light, fields, space, invalid) =>
  fucss({
    'dp:bk ta:l c:black200': true,
    'c:red': invalid,
    'm-l:5px': isCheckbox,
    'm-b:5px': (edit && !isCheckbox && !fields) || space,
    'w:100pc ta:l m-l:5px': fields
  })
