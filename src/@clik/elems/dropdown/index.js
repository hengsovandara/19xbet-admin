import react from 'react'
import { fucss } from 'next-fucss/utils'

export default props => (
  <div className={classNameConfirm(props.showDropdown)}>
    <div className="of:auto w,h:100pc bz:cbx of-y:scroll p:12px-27px-12px-12px">{props.children}</div>
  </div>
)

const classNameConfirm = show =>
  fucss({
    'bg:sec idx:1 mnw:300px r:0 m-r:5px ps:ab bs:2 ts:all of:hd bd-c:prim': true,
    'h:0': !show,
    'h:400px p-b:24px bd-t-w:1px': show
  })
