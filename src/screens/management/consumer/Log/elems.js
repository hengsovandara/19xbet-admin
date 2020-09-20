import { fucss } from 'next-fucss/utils'

export const classNameRow = isEven =>
  fucss({
    'ta:l p:16px-12px mnh:60px': true,
    'bg:F8F9FC bd-t:1px-sd-f0f0f0_div': isEven,
    'bd-t:1px-sd-f5f5f5_div': !isEven
  })

export const classNameBg = active =>
  fucss({
    'ps:rl dp:flx fd:col ai:c jc:sb flxw:wrap p:16px h:calc(100pc-200px) sm-h:calc(100pc-250px)': true,
    'bg:white': active,
    'bg:6BC4BC': !active
  })

export const classNameLogBtn = active =>
  fucss({
    'w,h,lh:40px mnw:40px ta:c c:white p:0 bd:2px-sd-fff br:50pc fs:.75em fw:700 bs:2 hv-try:1px ps:rl ts:all bg:6BC4BC': true
  })

export const classNameLogNot = active =>
  fucss({
    'ps:ab b:100pc l:100pc m-bl:10npx bg:red c:white lh:1 br:5px p:5px fs:.8em': true,
    'dp:none': active,
    'dp:ib': !active
  })

export const classNamePhoneBtn = active =>
  fucss({
    'w,h,lh:40px mnw:40px ta:c c:white p:0-! bd:2px-sd-fff br:50pc bs:2 hv-try:1px ps:rl ts:all bg:6BC4BC': true
  })

export const classNameChangeBtn = () =>
  fucss({
    'b:16px l:50pc trx:50npc ps:ab-! bg:fffa9_c:black_br:5px_fs:80pc_p:12px-16px_m-t:16px_md-m-t:0_w:100pc_mnw:100px_md-w:auto_bd:0_fw:600_label hv-bs:1_label p-b:2px_svg': true
  })

export const classNameUploadBtn = () =>
  fucss({
    'bg:none_c:prim_fs:.85em_p:12px-16px_m-t:16px_md-m-t:0_w:100pc_mnw:80px_md-w:auto_lh:1.25_bd:0_mxw:124px_ws:normal_bd:1px-dashed-prim_br:0_label p-b:2px_svg': true
  })

export const classNameImage = (document, fullWidth) => fucss({
  'bg-rp:nrp bg-pos:c bg-sz:cover h:200px flxb:50pc md-h:250px crs:pnt ps:ab r:0 ts:all hv-l:0': true,
  'l:0': fullWidth,
  'l:50pc': !fullWidth,
  'bg-pos:l': !fullWidth && document
})

export const classNameLogInput = isFocused =>
  fucss({
    'bd-b:1px-sd-ccc w:100pc p-r:25px p-tb:5px': true,
    'bd-c:prim c:prim': isFocused
  })

export const classNameLogSendBtn = isFocused =>
  fucss({
    'bg:none ps:ab r:0 t:0 fs:14px p:5px': true,
    'c:grey200': !isFocused,
    'c:prim ': isFocused
  })
