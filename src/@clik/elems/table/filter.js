import Input from '../input'
import Button from '../button'
import Dropdown from '../dropdown'
import { useState } from 'react'

export default props => {
  const [showDropdown, setDropdown] = useState()
  const filters = props.filters || {}
  const filtersLength = Object.keys(filters).length

  return (
    <div className="w:100pc">
      <div className="dp:flx">
        <Input light clearable live={1000} allowEmpty={true} placeholder="Enter Search Text" value={filters.keywords} name="keywords" action={props.action} className="ta:l m-t:5px" edit={true} noWrapper noSpace type="text" />
        <div className="ps:rl p:5px ta:l dp:flx">
          <Button small color={!showDropdown && 'sec'} className="fs:100pc mnw:100px" icon={!showDropdown ? 'filter' : 'check'} text={!showDropdown ? 'Filter' + ((filtersLength && `${filtersLength && 's'} (${filtersLength})`) || '') : 'Hide'} action={() => setDropdown(!showDropdown)} />
          <Dropdown
            light
            showDropdown={showDropdown}
            header={
              (filtersLength && (
                <div className="p:12px bd-b:1px-sld-grey200">
                  <Button link color="red" className="w:100pc ta:c" tiny text="Clear" action={() => (props.action(), setDropdown())} />
                </div>
              )) ||
              null
            }
            footer={
              <div className="p:12px bd-t:1px-sld-grey200">
                <Button link className="w:100pc ta:c" tiny text="Done" action={() => setDropdown()} />
              </div>
            }>
            {props.filterFields && props.filterFields.map(filter => <Input key={filter.label} light full clearable allowEmpty={true} allowSame={true} placeholder="Pick one" className="ta:l" mode="multiple" edit={true} value={filters[filter.name]} action={props.action} {...filter} />)}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
