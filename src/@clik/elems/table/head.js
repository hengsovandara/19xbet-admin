import { fucss } from 'next-fucss/utils'
import Button from '../button'
import Filter from './filter'
import Select from '../select'
import Search from './search'
import React from 'react'

export default props => {
  const { pagination, isSelected, results, onSelect, actions, selected, filters, filterFields, noTableHead = false } = props

  return (
    <div>
      { (!noTableHead && !isSelected) &&
        <div className={classNameHead(isSelected || pagination)}>
          {filterFields && <Filter filterFields={filterFields} filters={filters} action={props.action} />}
          <div className="dp:flx ai:c">
            <Search onClick={props.handleSearch} name={props.query?.name || props.query?.keywords || ''} />
            {!!props.handleStatus && <div className="w:100pc mxw:150px m-l:16px">
              <Select placeholder="Pick a status"
                options={props.statusOptions}
                value={props.status}
                onClick={value => props.handleStatus(value)}
              />
            </div>}
            {!!props.mainAction && <div className="m-l:16px">
              {props.mainAction() }
            </div>}
          </div>
        </div>
      }
      {actions && !!isSelected && 
        <div className={classNameActions(isSelected)}>
          {actions.map(action => (
            action.type === 'select' && <Select key={action.name} onClick={value => action.action(selected, value)} {...action} />
          ))}
          <div className="dp:flx h:40px">
            {actions.map(action => (
              action.type != 'select' && <Button key={action.name} {...action} action={e => action.action(selected)} />
            ))}
            <Button key="cancel" name="Cancel" bordered className="m-l:16px w:auto bg:ts c:black" action={e => onSelect()} />
          </div>
        </div>
      }
    </div>
  )
}

const classNameActions = (isSelected) =>
  fucss({
    'of:hd dp:flx ai:c bd-c:grey200': true,
    'h:0': !isSelected,
    'p-tb:24px of:vs': isSelected
  })

const classNameHead = () =>
  fucss({
    'bg:white jc:sb md-dp:flx ai:c p-tb:24px': true
  })
