import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icons = ({ amazonS3FaceImage, amazonS3IdDocument, amazonS3FaceVideo, documents }) => {
  return (
    <div>
      {documents && documents.length > 0 && (
        <span className="fw:800 ta:c m:3px">
          <FontAwesomeIcon icon="file" /> ({documents.length})
        </span>
      )}
      {amazonS3FaceImage && <FontAwesomeIcon className="m:3px" icon="camera" />}
      {amazonS3IdDocument && <FontAwesomeIcon className="m:3px" icon="id-card" />}
      {amazonS3FaceVideo && <FontAwesomeIcon className="m:3px" icon="video" />}
    </div>
  )
}

export default Icons
