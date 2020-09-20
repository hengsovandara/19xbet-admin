import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// If you see these wierd className, PLEASE DO NOT REMOVE! IT IS FOR TESTING PURPOSE!
export const Card = ({ link, label, total, pendingNumber, activatedNumber, declinedNumber }) => (
  <div className={`w:100pc p:24px br:5px bg:white mxw:500px card-${label}`}>
    <div className="dp:flx jc:sb">
      <div className="w:33pc dp:flx ai:c jc:c">
        <FontAwesomeIcon icon="tasks" className="c:e8e8e8 fs:350pc sm-fs:400pc md-fs:450pc xl-fs:550pc m-b:12px m-r:12px" />
      </div>
      <div className="w:70pc p-l:12px">
        <Link href={'/' + 'management' + '?step=consumers'}>
          <div className="crs:pt bd:1px-sd-f0f0f0 c:sec p:16px-12px md-p:25px-16px bg:F8F9FC br:5px ps:rl of:hd ts:all hv-try:2px m-b:24px bs:1">
            <p className={`fw:700 fs:1.5em md-fs:2em lg-fs:3em total-${label}`}>{total}</p>
            <p className="fs:1em md-fs:1.25em lg-fs:1.5em tt:capitalize">{label}</p>
          </div>
        </Link>
      </div>
    </div>
    <div className="dp:flx flxw:wrap jc:sb fd:col sm-fd:row ps:rl m-rl:10npx">
      <div className="w:100pc sm-w:33.33pc p-rl:12px smx-m-b:24px">
        <Link href={'/' + 'management' + '?step=team'}>
          <div className="crs:pt bd:1px-sd-orange c:white p:12px md-p:16px bg:orange br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px pending-${label}`}>{pendingNumber || 0}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Teams</p>
          </div>
        </Link>
      </div>
      <div className="w:100pc sm-w:33.33pc p-rl:12px smx-m-b:24px">
        <Link href={'/' + 'management' + '?step=assigned'}>
          <div className="crs:pt bd:1px-sd-6BC4BC c:white p:12px md-p:16px bg:6BC4BC br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px activated-${label}`}>{activatedNumber}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Yours</p>
          </div>
        </Link>
      </div>
      <div className="w:100pc sm-w:33.33pc p-rl:12px">
        <Link href={'/' + 'management'}>
          <div className="crs:pt bd:1px-sd-green c:white p:12px md-p:16px bg:green br:5px ps:rl of:hd ts:all hv-try:2px bs:1">
            <p className={`fw:700 fs:1.5em m-b:5px completed-${label}`}>{declinedNumber}</p>
            <p className="fw:600 md-fs:0.75em xl-fs:1em">Completed</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
)
