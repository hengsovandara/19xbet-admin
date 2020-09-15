import { fucss } from 'next-fucss/utils'
import Button from '../button'
import Filter from './filter'
import Dropdown from '../select'
import Search from './search'

import { STATUS } from '../../data'

export default props => {
  const { pagination, isSelected, results, onSelect, actions, selected, filters, filterFields } = props

  return (
    <div>
      <div className={classNameHead(isSelected || pagination)}>
        {filterFields && <Filter filterFields={filterFields} filters={filters} action={props.action} />}
        <div className="w:100pc dp:flx ai:c jc:sb">
          <div className="fw:300 fs:80pc c:sec ws:np m-r:20px mdx-m-tb:10px w:20pc">
            {!isSelected ? 'Results' : 'Selected'}:{' '}
            <strong>
              {results}
              {(pagination && pagination.overall) || '0'}
            </strong>
          </div>
          <Search onClick={props.handleSearch} name={props.query.name || ''} />
          <div className="m-l:20px w:100pc mxw:150px">
            <Dropdown placeholder="Pick a status"
              options={STATUS}
              value={props.status}
              onClick={(value) => props.handleClick(value)}
            />
          </div>
        </div>
      </div>
      {actions && (
        <div className={classNameActions(isSelected)}>
          <Button key="cancel" name="Cancel" tiny color="sec" className="m-r:20px" link action={e => onSelect()} />
          {actions.map(action => (
            <Button key={action.name} {...action} action={e => action.action(selected)} />
          ))}
        </div>
      )}
    </div>
  )
}

const classNameActions = isSelected =>
  fucss({
    'ta:r ts:all of:hd bg:grey100 dp:flx jc:fe ai:c': true,
    'h:0': !isSelected,
    'p:15px bd-b:1px-sld-grey200 bs:1': isSelected
  })

const classNameHead = isSelected =>
  fucss({
    'bg:white ts:all jc:sb md-dp:flx ai:c p-b:20px md-p-tb:20px': true
  })
