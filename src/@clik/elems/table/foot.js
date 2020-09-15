import { fucss } from 'next-fucss/utils'
import Pagination from './pagination'

export default ({ pagination, handlePagination }) => {
  return (
    <div>
      <div className={classNameHead(true)}>
        {pagination.overall >= 1
        ? <Pagination {...pagination} handlePagination={handlePagination} />
        : <div className="dp:flx fd:col jc:c w:100pc c:sec bg:white">
            <div className="w:100pc dp:flx jc:c ai:c fs:200pc fw:500">
              <div className="p-rl:20px m-r:40px">
                <img src="static/imgs/empty.png"/>
                <p className="fs:90pc fw:600">No Data</p>
              </div>
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
    'p:20px-0 bd-b:1px-sld-grey200': isSelected
  })
