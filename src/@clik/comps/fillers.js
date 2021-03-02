import { fucss } from 'next-fucss/utils'
import Icon from '../elems/icon'
import Button from '../elems/button'
import Markdown from 'markdown-to-jsx'

export const ElemProgressBar = ({ value, light }) => (
  <div className={classNameBarContainer(light)}>
    <div className={classNameBar(value, light)} style={{ width: value + '%' }}>
      {value + '% complete'}
    </div>
  </div>
)

const classNameBarContainer = light =>
  fucss({
    'dp:flx jc:fs w:100pc br:5px p:5px': true,
    'c:white bg:sec': !light,
    'c:sec bg:white bs:1': light
  })

const classNameBar = (value, light) =>
  fucss({
    'ta:c ts:all fs:80pc fw:600 br:2px ws:np mxh:30px p:5px': true,
    'bg:white c:inh ta:c': !value,
    'bg:greena9 c:white': value >= 90,
    'bg:orange': value > 50 && value < 90,
    'bg:reda8 c:white': value <= 50 && value
  })

export const ElemLoading = ({ centerd, className, onClose }) => (
  <div onClick={e => onClose()} className={'w:100pc h:85pc dp:flx ai:c jc:c t:0 ' + className} style={{ minHeight: 'inherit' }}>
    <span className="br:100pc w,h:40px bg-c:prim an:scaler-1s-inf-eio" />
  </div>
)

export const ElemFog = ({ onClick, mobile }) => <div onClick={onClick} className={classNameFog(mobile)} />

const classNameFog = mobile =>
  fucss({
    'bg:blacka5 w:100pc mnh:100vh ps:fx l,t:0 t:0': true,
    'lg-dp:n z:2': mobile,
    'z:10': !mobile
  })

export const ElemError = ({ error }) => (
  <div className="w:100pc h:85pc dp:flx ai:c t:0 ta:c" style={{ minHeight: 'inherit' }}>
    <h1 className="fs:300pc fw:100">{error.error || error || 'Error'}</h1>
  </div>
)

export const ElemCircle = ({ percent = 30, children, prim = '#1FB5A7', sec, light, size }) => {
  sec = sec || light ? '#e0e0e0' : '#0B2E4B'
  let primDeg,
    secDeg,
    overall = 180
  const aboveHalf = percent > 50
  if (!aboveHalf) {
    primDeg = 90 + overall * ((percent * 2) / 100)
    secDeg = 90
    overall + primDeg
  } else {
    primDeg = 90 + overall * (((percent - 50) * 2) / 100)
    secDeg = 90
  }

  return (
    <span
      className={classNameCircle(light, size)}
      style={{
        backgroundImage: `linear-gradient(${primDeg}deg, transparent 50%, ${aboveHalf ? prim : sec} 50%),linear-gradient(${secDeg}deg, ${sec} 50%, transparent 50%)`,
        backgroundColor: prim
      }}>
      {children}
    </span>
  )
}

const classNameCircle = (light, size) =>
  fucss({
    'br:50pc ts:all ps:rl': true,
    'p:2px': !size,
    'p:3px': size === 'medium',
    'p:4px': size === 'large',
    'p:5px': size === 'extra'
  })

export const ElemProgressCircle = ({ score, size, invert, light }) => (
  <ElemCircle light={light} size={size} percent={score} prim={score && score < 50 ? '#ff5245' : score && score < 90 ? 'orange' : '#4CAF50'}>
    <span className={classNameProgressCircle(size, invert || light)}>{score}</span>
  </ElemCircle>
)

const classNameProgressCircle = (size, invert) =>
  fucss({
    'br:50pc fw:600': true,
    'bg:sec': !invert,
    'bg:white': invert,
    'w,h,lh:25px fs:90pc': !size,
    'w,h,lh:45px fs:120pc': size === 'medium',
    'w,h,lh:75px fs:140pc': size === 'large',
    'w,h,lh:100px fs:160pc': size === 'extra'
  })

export const ElemPopup = ({ onClose, children, isFullscreen, isLoading, wrap, esc, low }) => {
  return (
    <div className={classNamePopupContainer({ low })}>
      <div className="ps:rl w,h:100pc z:6 t,l:0 an:fadeIn-1s bg:blacka7" onClick={onClose} />
      {esc && (
        <div className="ps:ab r,t:0 hv-bg:sec600 ts:all crs:pt" onClick={onClose}>
          <Icon icon="times" size="2x" />
          <div className="fs:75pc">esc</div>
        </div>
      )}
      <div className={classNamePopup(isFullscreen)}>{!isLoading ? !wrap ? children : <div className="bg:white bs:2 p:24px br:8px c:black">{children}</div> : <ElemLoading />}</div>
    </div>
  )
}

const classNamePopupContainer = props =>
  fucss({
    'ps:fx t,l,r:0 dp:flx ai:c w:100pc h:100vh jc:c': true,
    'z:20': !props.low,
    'z:15': props.low
  })

export const ElemInfo = ({ onClose, info, isResponse, statusCode }) => {
  const success = statusCode === 200 && isResponse || info?.type === 'success'
  console.log({info})
  return (
    <ElemPopup onClose={onClose}>
      <div className="bg:white p:24px p-t:36px br:8px c:black200">
        <Icon icon={success ? 'smile' : 'frown'} className={success ? 'c:prim' : 'c:red'} size="3x" />
        <h2 className="fs:150pc m-tb:24px">{success ? 'Success!' : 'Oh snap!'}</h2>
        <Markdown className="fs:85pc fw:400 m-b:36px">{(typeof info === 'object' ? info?.message : info) || ''}</Markdown>
        <div className="dp:flx ai:c jc:c"><Button bordered prim text="Got It!" action={onClose} /></div>
      </div>
    </ElemPopup>
  )
}

const classNamePopup = isFullscreen =>
  fucss({
    'ps:ab z:10 ts:all an:land-0.5s mnw:300px': true,
    'mxh:100vh mxw:1200px': isFullscreen,
    'mxw:600px': !isFullscreen
  })

export const ElemPhoto = ({ url, photo, logo, size, action }) => (
  <span className={classNamePhoto(size, action)} onClick={action}>
    {photo || logo || url ? <span style={{ backgroundImage: `url(${photo || logo || url})` }} className="bg-sz:cv bg-ps:c w,h:100pc br:50pc dp:bk" /> : <Icon icon="user" size="lg" className="crs:pt op:0.8" />}
  </span>
)

const classNamePhoto = (size, action) =>
  fucss({
    'br:50pc m:8px-0 bs:2 of:hd ta:c': true,
    'hv-scl:1.05 ts:all crs:pt': action,
    'h,w,lh:85px': size === 'large',
    'h,w,lh:65px': size === 'medium',
    'h,w,lh:35px': !size
  })

export const ElemSplash = ({ children, onClose }) => (
  <div className="ps:fx w:100pc mnh:100vh t,r:0 bg:sec z:10 dp:flx an:fadeIn-0.5s ai:c ta:c">
    <span className="ps:ab r,t:0 p:24px-32px hv-bg:sec600 ts:all crs:pt" onClick={onClose}>
      <Icon icon="times" size="2x" />
      <div className="fs:75pc">esc</div>
    </span>
    <div className="of:auto">{children}</div>
  </div>
)

export const ElemConfirm = ({ action }) => {
  return (
    <ElemPopup onClose={e => action()}>
      <div className="bg:white p:24px p-t:36px br:8px">
        <Icon className="c:orange m-b:36px" icon="exclamation-circle" size="3x" />
        <h2 className="m-b:24px c:black">Confirmation</h2>
        <p className="m-b:24px ta:c m-b:36px c:black">
          Are you sure you want to
          <br />
          perform this action?
        </p>
        <div className="dp:flx ai:c jc:sb">
          <Button text="Yes" className="w:calc(50pc-8px)" bordered prim action={e => action(true)} />
          <Button text="No" className="w:calc(50pc-8px)" bordered alert action={e => action()} />
        </div>
      </div>
    </ElemPopup>
  )
}

export const ElemMessage = () => (
  <div className="ps:fx t:0 w:100pc z:10 bg:white">
    <div>
      <Icon icon="check-circle" className="m-r:12px" />
      <p>This is a success message</p>
    </div>
  </div>
)
