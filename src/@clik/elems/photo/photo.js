import { Fragment } from 'react'
import { fucss } from 'next-fucss/utils'
import UploadPhoto from './upload'
import Camera from './camera'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Photo = ({ light, single, cameraMode, onClose, onFullscreen, onSwitchCamera, uploadImages, handleCameraModeToggle, dragEnterOver, handleDrop, handleClick, triggerUpload }) => {
  return (
    <div className={classNameContainer(light)}>
      {!cameraMode ? (
        <div className="p:24px">
          <div className={classNameInner(light)}>
            <h3 className="c:white md-fs:150pc fw:400">Change Profile Picture</h3>
            <div className="ps:ab t:12px r:12px lh:1 fs:24px c:white crs:pt" onClick={onClose}>
              <FontAwesomeIcon className="c:white hv-c:prim-! ts:all" icon="times" />
            </div>
          </div>
          <div className="dp:flx fd:col md-fd:row jc:c ai:c ta:c w:100pc c:white p:24px p-b:0">
            <div className="w:100pc mxw:200px p-tb:24px bd-b:1px-sd-whitea2 md-bd-b:0 md-bd-r:1px-sd-whitea2">
              <div className="dp:flx jc:c ai:c crs:pt hv-c:prim ts:all" onClick={handleCameraModeToggle}>
                <div>
                  <FontAwesomeIcon className="fa-3x" icon="camera" />
                  <p className="p:16px mdx-p-b:0 fs:85pc fw:600">Take a photo using your camera</p>
                </div>
              </div>
            </div>
            <div className="w:100pc mxw:200px p-tb:24px">
              <UploadPhoto single={single} className="dp:flx jc:c ai:c crs:pt hv-c:prim ts:all" uploadImages={uploadImages} triggerUpload={triggerUpload} onClick={handleClick} onDragEnterOver={dragEnterOver} onDrop={handleDrop} />
            </div>
          </div>
        </div>
      ) : (
        <div className="p:12px p-b:5px">
          <Camera onClose={onClose} onFullscreen={onFullscreen} onSwitchCamera={onSwitchCamera} onClick={handleCameraModeToggle} uploadImage={uploadImages} />
        </div>
      )}
    </div>
  )
}

export default Photo

const classNameContainer = light =>
  fucss({
    'bg:282828 br:5px ps:rl bs:2': true
  })

  const classNameInner = () =>
  fucss({
    'p-b:24px p-t:25px md-p-t:16px bd-b:1px-sd-whitea4': true
  })
