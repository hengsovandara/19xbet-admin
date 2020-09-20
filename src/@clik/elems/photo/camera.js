import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Camera extends Component {
  constructor(props) {
    super(props)
    this.state = { isFront: true }
  }

  componentWillMount() {
    const { isFront } = this.state
    this.openCamera({ audio: false, video: { facingMode: isFront ? 'user' : 'environment' } })
  }

  componentWillUpdate() {
    const { isFront } = this.state
    this.openCamera({ audio: false, video: { facingMode: isFront ? 'user' : 'environment' } })
  }

  openCamera(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.video.srcObject = stream
          this.video.onloadedmetadata = e => {
            this.video.play()
          }
        })
        .catch(err => console.log(err.name + ': ' + err.message))
    } else {
      alert('Sorry, your browser does not support getUserMedia')
    }
  }

  handleCloseCamera = () => {
    this.video.pause()
    this.video.srcObject = '' || null

    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }

    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: this.state.isFront ? 'user' : 'environment' } }).then(stream => {
      this.video = stream.getVideoTracks()[0].stop()
    })

    return this.props.onClick()
  }

  drawImage() {
    const imageWidth = this.video.videoWidth
    const imageHeight = this.video.videoHeight
    const context = this.canvas.getContext('2d')

    this.canvas.width = imageWidth
    this.canvas.height = imageHeight

    context.drawImage(this.video, 0, 0, imageWidth, imageHeight)

    return {
      imageWidth,
      imageHeight
    }
  }

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  captureBlobPhoto() {
    const { imageWidth, imageHeight } = this.drawImage()
    const { uploadImage } = this.props
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(blob => {
        resolve({ blob, imageWidth, imageHeight })
      })
    }).then(image => {
      const url = this.canvas.toDataURL(image)
      const file = this.dataURLtoFile(url, new Date().getTime())
      this.handleCloseCamera()
      return uploadImage(file)
    })
  }

  handleSwitchCamera() {
    this.setState({ isFront: !this.state.isFront })
  }

  render() {
    const { onFullscreen } = this.props

    return (
      <div className="ps:rl w:100pc">
        <div className="w:100pc">
          <video
            className="w:100pc h:auto"
            ref={video => {
              this.video = video
            }}
            autoPlay
            className="w:100pc"></video>
          <canvas
            ref={canvas => {
              this.canvas = canvas
            }}
            className="dp:n w:100pc"></canvas>
        </div>
        <div className="">
          <button className="ps:ab t,l:0 bg:ts p:12px" type="button" onClick={this.handleCloseCamera}>
            <FontAwesomeIcon className="fa-2x c:white" icon="arrow-left" />
          </button>
          <button className="z:2 ps:ab t,r:0 bg:ts p:12px" type="button" onClick={this.handleSwitchCamera.bind(this)}>
            <FontAwesomeIcon className="fa-2x c:white" icon="sync" />
          </button>
          <button
            className="z:1 ps:ab b,l:0 bg:ts p:12px"
            type="button"
            onClick={async event => {
              const photo = await this.captureBlobPhoto()
            }}>
            <FontAwesomeIcon className="fa-2x c:white" icon="camera" />
          </button>
          <button className="ps:ab b,r:0 p:12px bg:ts" type="button" onClick={onFullscreen}>
            <FontAwesomeIcon className="fa-2x c:white" icon="expand" />
          </button>
        </div>
      </div>
    )
  }
}
