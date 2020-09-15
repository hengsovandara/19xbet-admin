import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ElemPopup } from '../../comps/fillers'
import { fucss } from 'next-fucss/utils'

export default props => {
  const { backgroundPosition, isZoomed, deg } = props

  return (
    <div>
      {props.show ? (
        <ElemPopup isFullscreen={props.isFullscreen} onClose={props.onToggleShow}>
          <div className="bg-rp:nrp bg-c:sec bd:10px-sd-white br:5px" ref={img => props.onImageBgRef(img)} style={{ backgroundImage: `url(${props.image.url || props.image})`, backgroundPosition, transform: `rotate(${deg}deg)`, transformOrigin: 'center' }} onMouseDown={e => props.onZoomIn(e)} onMouseUp={props.onZoomOut} onMouseMove={e => isZoomed && props.onZoomIn(e)} onTouchStart={e => props.onZoomIn(e)} onTouchEnd={props.onZoomOut} onTouchMove={e => isZoomed && props.onZoomIn(e)}>
            <img ref={img => props.onImageRef(img)} src={props.image.url || props.image} className={classNameImage(isZoomed)} />
          </div>
        </ElemPopup>
      ) : (
        <img src={props.image.url || props.image} className="h:150px bd:5px-sld-sec600 m:5px-5px-0-0" onClick={props.onToggleShow} />
      )}
      <div className="ps:fx b:20px l:50pc trx:50npc z:20 p:10px-20px_br:5px_bg:white_c:prim_bs:1_dp:ib_m:0-5px_m-t:10px_button">
        <button onClick={props.onRotate} className="hv-try:1px ts:all">
          <FontAwesomeIcon icon="sync" className="fs:.95em m-r:5px" /> Rotate
        </button>
        <button onClick={props.onFullscreen} className="hv-try:1px ts:all">
          <FontAwesomeIcon icon="expand" className="fs:.95em m-r:5px" /> Zoom
        </button>
      </div>
    </div>
  )
}

const classNameImage = hide =>
  fucss({
    'mxh:80vh mxw:100pc dp:bk': true,
    'op:0 crs:n': hide
  })
