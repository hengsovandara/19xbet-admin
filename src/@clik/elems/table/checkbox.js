import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ onSelect, isChecked }) => {
  return (
    <label onClick={e => e && e.stopPropagation()} title="Select item to delete" className="bg:grey100 bd:1px-sld-grey200 br:5px w,h,lh:20px hv-c:grey ts:all">
      {isChecked && <FontAwesomeIcon className="fs:80pc" icon="check" />}
      <input className="dp:n" type="checkbox" onChange={onSelect} checked={isChecked} />
    </label>
  )
}
