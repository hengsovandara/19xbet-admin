import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils';
// import Input from '../input';

export default props => {
  const { pages, current, last, limit, handlePagination } = props || {}
  const [page, setPage] = useState(current || 1);

  useEffect(() => {
    setPage(current);
  }, [current])

  if (!limit) return null

  return (
    <div className="c:sec fs:90pc dp:flx ai:c">
      {pages && current > 1 && 
        <a onClick={ e => {
          setPage(1);
          handlePagination(1)
        }} 
          className="bd:1px-sd-blacka15 br:3px m-r:8px w,h:30px hv-bd:1px-sd-prim_c:prim dp:flx ai:c jc:c">
          <FontAwesomeIcon icon="angle-double-left" />
        </a>
      }

      {pages && current > 1 && 
        <a onClick={ e => {
          setPage(current - 1);
          handlePagination(current - 1)
        }} 
          className="bd:1px-sd-blacka15 br:3px m-r:8px w,h:30px hv-bd:1px-sd-prim_c:prim dp:flx ai:c jc:c">
          <FontAwesomeIcon icon="angle-left" />
        </a>}

      { <>
        <div>
          <input
            type="number"
            className="ta:c c:sec p:4px-11px ta:c w:50px h:30px bd:1px-sd-blacka15 br:3px-0-0-3px fc-bd:1px-sd-prim_br:3px-0-0-3px"
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
        </div>
        <span className="p:5px-11px bd:1px-sd-blacka15 bd-l:none br:0-3px-3px-0 m-r:8px w:50px h:30px bg:blacka1 c:sec dp:flx ai:c jc:c">
          {last}
        </span>
        </>
      }

      {pages && current < last && 
        <a onClick={e => {
          setPage(current + 1);
          handlePagination(current + 1)
        }} 
          className="bd:1px-sd-blacka15 br:3px m-r:8px w,h:30px hv-bd:1px-sd-prim_c:prim dp:flx ai:c jc:c">
          <FontAwesomeIcon icon="angle-right" />
        </a>
      }
      { pages && current < last && 
        <a onClick={ e => {
          setPage(last)
          handlePagination(last)
        }} 
          className="bd:1px-sd-blacka15 br:3px m-r:8px w,h:30px hv-bd:1px-sd-prim_c:prim dp:flx ai:c jc:c">
          <FontAwesomeIcon icon="angle-double-right" />
        </a>
      }
    </div>
  )
}

