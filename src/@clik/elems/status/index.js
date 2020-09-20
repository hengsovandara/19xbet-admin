import React from 'react'
import { fucss } from 'next-fucss/utils'

const Status = props => {
  let { title, assignment, id } = props
  title = title === 'Failed' ? 'Updating' : title

  return (
    <div className="p-l:24px md-p-rl:24px dp:flx ai:c jc:c">
      {id && assignment && (
        <div
          className="bg-sz:cv bg-ps:c dp:bk bg-c:grey w,h:30px br:4px hv-scl:2.75_l:5px z:2 m-l:10npx m-r:12px ts:all bd:1px-sd-e8e8e8"
          style={{ backgroundImage: `url("${assignment.user.photo}")` }}
        />
      )}
      <div className={classNameBorderStatus(title)}></div>
      {title}
    </div>
  )
}

const classNameBorderStatus = title => fucss({
  'ps:ab t,l,b:0': true,
  'bd-l:4px-sld-white h:100pc': 'Created' === title,
  'bd-l:4px-sld-prim': 'Active' === title,
  'bd-l:4px-sld-orange': 'Pending' === title,
  'bd-l:4px-sld-00d061': 'Verified' === title,
  'bd-l:4px-sld-red': 'Decline' === title,
  'bd-l:4px-sld-black': 'Disable' === title
})

export default Status
