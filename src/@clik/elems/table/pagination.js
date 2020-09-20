import React, { useState, useEffect } from 'react';
import Icon from '../icon'

export default props => {
  const { pages, current, last, limit, handlePagination, overall } = props || {}
  const [page, setPage] = useState(current || 1);
  useEffect(() => {
    setPage(current);
  }, [current])

  if (!limit) return null

  return (
    <div className="dp:flx ai:c">
      {pages && current > 1 &&
        <a onClick={ e => {
          setPage(1);
          handlePagination(1)
        }}
          className="br:4px m-r:8px w,h:35px c:black200 hv-c:prim dp:flx ai:c jc:c bd:1px-sd-grey200 hv-bd-c:prim fs:150pc ts:all">
          <Icon icon="angle-double-left" />
        </a>
      }

      {pages && current > 1 &&
        <a onClick={ e => {
          setPage(current - 1);
          handlePagination(current - 1)
        }}
          className="c:prim br:4px m-r:8px w,h:35px c:black200 hv-c:prim dp:flx ai:c jc:c bd:1px-sd-grey200 hv-bd-c:prim fs:150pc ts:all">
          <Icon icon="angle-left" />
        </a>}

      { <>
        {current - 1 > 0 && <div className="bd:1px-sd-prim br:4px w:40px h:35px bg:ts c:black200 dp:flx ai:c jc:c m-r:8px">
          {current - 1}
        </div>}
        {last > 1 && <div>
          <input
            type="number"
            className={"ta:c bg:prim c:white ta:c w:40px h:35px br:4px"}
            value={page}
            onChange={e => setPage(e.target.value)}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                e.preventDefault();
                setPage(e.target.value);
                handlePagination(page);
              }
            }}
          />
        </div>}
        {current != last && <div className="bd:1px-sd-prim br:4px m-r:8px w:40px h:35px bg:ts c:black200 dp:flx ai:c jc:c m-l:8px">
          {last}
        </div>}
        </>
      }

      {pages && current < last &&
        <a onClick={e => {
          setPage(current + 1);
          handlePagination(current + 1)
        }}
          className="br:4px m-r:8px w,h:35px c:black200 hv-c:prim dp:flx ai:c jc:c bd:1px-sd-grey200 hv-bd-c:prim fs:150pc ts:all">
          <Icon icon="angle-right" />
        </a>
      }
      { pages && current < last &&
        <a onClick={ e => {
          setPage(last)
          handlePagination(last)
        }}
          className="br:4px m-r:8px w,h:35px c:black200 hv-c:prim dp:flx ai:c jc:c bd:1px-sd-grey200 hv-bd-c:prim fs:150pc ts:all">
          <Icon icon="angle-double-right" />
        </a>
      }
    </div>
  )
}
