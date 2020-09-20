import Icon from '../icon'
import { fucss } from 'next-fucss/utils'

export default ({ onSelect, isChecked }) => {
  return (
    <label onClick={e => e && e.stopPropagation()} title="Select item to delete" className={classNameLabel(isChecked)}>
      {isChecked && <Icon className="ps:ab t,l:4px fs:12px c:white" icon="check" />}
      <input className="dp:n" type="checkbox" onChange={onSelect} checked={isChecked} />
    </label>
  )
}

const classNameLabel = (isChecked) => fucss({
  'ps:rl br:3px w,h,lh:22px hv-c:grey ts:all': true,
  'bg:prim bd:1px-sld-prim': isChecked,
  'bd:1px-sld-blacka12': !isChecked
})