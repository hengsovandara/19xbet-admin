import { Component } from 'react'
import { fucss } from 'next-fucss/utils'

export default props => (
  <div className={classNameConfirm(props.showDropdown)}>
    <div className="of:auto w,h:100pc bz:cbx of-y:scroll p:10px-27px-10px-10px">{props.children}</div>
  </div>
)

const classNameConfirm = show =>
  fucss({
    'bg:sec idx:1 mnw:300px r:0 m-r:5px ps:ab bs:2 ts:all of:hd bd-c:prim': true,
    'h:0': !show,
    'h:400px p-b:20px bd-t-w:1px': show
  })
