import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

const Upload = ({ uploadImages, onDragEnterOver, onDrop, onClick, className, single }) => {
  return (
    <div className={className} onDragEnter={onDragEnterOver} onDragOver={onDragEnterOver} onDrop={onDrop} onClick={() => onClick('images')}>
      <div>
        <FontAwesomeIcon className="fa-3x" icon={faCloudUploadAlt} />
        <p className="fs:85pc fw:600 p:16px">Drag and drop or click to upload your images here</p>
      </div>
      <input id="images" type="file" accept="image/*, image/png, image/jpeg; capture=camcorder" multiple={!single} className="dp:n" onChange={e => uploadImages(e.target.files)} />
    </div>
  )
}

export default Upload
