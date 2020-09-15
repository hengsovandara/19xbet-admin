import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// If you see these wierd className, PLEASE DO NOT REMOVE! IT IS FOR TESTING PURPOSE!
export const Card = ({ link, label, total, pendingNumber, activatedNumber, declinedNumber }) => (
  <div className={`w:100pc p:20px br:5px bg:white mxw:500px card-${label}`}>
    <div className="dp:flx jc:sb">
      <div className="w:33pc dp:flx ai:c jc:c">
        <FontAwesomeIcon icon={label == 'consumers' ? 'shopping-basket' : 'store'} className="c:e8e8e8 fs:350pc sm-fs:400pc md-fs:450pc xl-fs:550pc m-b:10px m-r:10px" />
      </div>
      <div className="w:70pc p-l:10px">
        <Link href={'/' + link}>
          <div className="crs:pt bd:1px-sd-f0f0f0 c:sec p:15px-10px md-p:25px-15px bg:F8F9FC br:5px ps:rl of:hd ts:all hv-try:2px m-b:20px bs:1">
            <p className={`fw:700 fs:1.5em md-fs:2em lg-fs:3em total-${label}`}>{total}</p>
            <p className="fs:1em md-fs:1.25em lg-fs:1.5em tt:capitalize">{label}</p>
          </div>
        </Link>
      </div>
    </div>
    <div className="dp:flx flxw:wrap jc:sb fd:col sm-fd:row ps:rl m-rl:10npx">
      <div className="w:100pc sm-w:33.33pc p-rl:10px smx-m-b:20px">
        <Link href={'/' + link + '?status=2'}>
          <div className="crs:pt bd:1px-sd-orange c:white p:10px md-p:15px bg:orange br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px pending-${label}`}>{pendingNumber}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Pending</p>
          </div>
        </Link>
      </div>
      <div className="w:100pc sm-w:33.33pc p-rl:10px smx-m-b:20px">
        <Link href={'/' + link + '?status=1'}>
          <div className="crs:pt bd:1px-sd-6BC4BC c:white p:10px md-p:15px bg:6BC4BC br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px activated-${label}`}>{activatedNumber}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Active</p>
          </div>
        </Link>
      </div>
      <div className="w:100pc sm-w:33.33pc p-rl:10px">
        <Link href={'/' + link + '?status=8'}>
          <div className="crs:pt bd:1px-sd-f57167 c:white p:10px md-p:15px bg:f57167 br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px declined-${label}`}>{declinedNumber}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Declined</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
)
