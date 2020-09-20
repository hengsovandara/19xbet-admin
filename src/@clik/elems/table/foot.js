import { fucss } from 'next-fucss/utils'
import Pagination from './pagination'
import Icon from '../icon'

export default ({ pagination, handlePagination, noTableFoot = false }) => {
  if(noTableFoot) return null
  return (
    <div>
      <div className={classNameHead(true)}>
        {pagination.overall > 15
        ? <Pagination {...pagination} handlePagination={handlePagination} />
        : (pagination.overall === 0) && <div className="dp:flx fd:col jc:c w:100pc c:black300">
            <div className="w,h:100pc dp:flx flxd:col jc:c ai:c p:40px">
              <Icon className="m-b:36px w,h:80px" type="clik" icon="clipboard-check" />
              <h2 className="m-b:16px">Empty Table</h2>
              <p className="xw:400px">There are no data provided in this table or<br></br>clear the filter if one is applied.</p>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

const classNameHead = isSelected =>
  fucss({
    'bg:white ts:all jc:c dp:flx ai:c': true,
    'p-t:24px': isSelected
  })
