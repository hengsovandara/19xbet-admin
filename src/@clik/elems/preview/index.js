import { Component } from 'react'
import ZoomImage from './preview'
import { rotateImage } from './rotate'

export default class extends Component {
  state = {
    show: false,
    isFullscreen: false,
    backgroundPosition: null,
    backgroundSize: null,
    deg: null,
    rTop: 0,
    rRight: 0,
    rBottom: null,
    rLeft: null,
    fTop: null,
    fRight: 0,
    fBottom: 0,
    fLeft: null
  }

  componentDidMount() {
    this.props.getMethods && this.props.getMethods({ handleToggleShow: this.handleToggleShow.bind(this) })
  }

  handleToggleShow(img) {
    this.setState({ show: !this.state.show, img })
  }

  handleFullscreen(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isFullscreen: !this.state.isFullscreen })
    return false
  }

  onImageBgRef(ref) {
    this.imageBG = ref
  }

  onImageRef(ref) {
    this.image = ref
  }

  move(e) {
    const rect = e.target.getBoundingClientRect()

    const width = rect.width / 2
    const height = rect.height / 2

    const x = e.clientX - rect.left - width / 2
    const y = e.clientY - rect.top - height / 2

    this.setState({
      indicatorPosition: { x, y, height, width }
    })
  }

  // checkDeviceType = () =>  {
  //   const isMobile = navigator.userAgent.match(/Android/i)
  //     || navigator.userAgent.match(/webOS/i)
  //     || navigator.userAgent.match(/iPhone/i)
  //     || navigator.userAgent.match(/iPad/i)
  //     || navigator.userAgent.match(/iPod/i)
  //     || navigator.userAgent.match(/BlackBerry/i)
  //     || navigator.userAgent.match(/Windows Phone/i);
  //   if (!isMobile) {
  //     // console.log('Desktop')
  //     // console.log({ clientX: e.nativeEvent.clientX })
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // }

  zoomIn(e) {
    // console.log({ e: e.nativeEvent }, e.type)

    let image = this.image
    let imageBG = this.imageBG
    let x, y

    const rect = e.target.getBoundingClientRect()

    if (e.nativeEvent.touches && e.nativeEvent.touches[0]) {
      x = e.nativeEvent.touches[0].clientX - rect.left
      y = e.nativeEvent.touches[0].clientY - rect.top
    } else {
      e.preventDefault()
      e.stopPropagation()
      x = e.nativeEvent.clientX - rect.left
      y = e.nativeEvent.clientY - rect.top
    }

    const posX = (image.naturalWidth / rect.width) * x
    const posY = (image.naturalHeight / rect.height) * y

    const cX = x - rect.width / 2
    const cY = y - rect.height / 2

    const bgX = -posX + (rect.width / 2 + cX)
    const bgY = -posY + (rect.height / 2 + cY)

    this.setState({
      isZoomed: true,
      backgroundPosition: [bgX + 'px', bgY + 'px'].join(' ')
    })

    // console.log({ width: image.naturalWidth, height: image.naturalHeight, posX, posY, x, y })
  }

  zoomOut(e) {
    // this.checkDeviceType.bind(this);
    if (!(e.nativeEvent.touches && e.nativeEvent.touches[0])) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.setState({ isZoomed: false })
  }

  handleRotate(e) {
    let deg = this.state.deg + 90

    if (deg === 360) deg = 0

    const { rTop, rRight, rBottom, rLeft, fTop, fRight, fBottom, fLeft } = rotateImage(deg)

    this.setState({ deg, rTop, rRight, rBottom, rLeft, fTop, fRight, fBottom, fLeft })

    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const { show, isFullscreen, img, backgroundPosition, backgroundSize, indicatorPosition, isZoomed, deg } = this.state

    return (show && <ZoomImage {...this.state} image={img} onImageBgRef={this.onImageBgRef.bind(this)} onImageRef={this.onImageRef.bind(this)} onFullscreen={this.handleFullscreen.bind(this)} onToggleShow={this.handleToggleShow.bind(this)} onZoomIn={this.zoomIn.bind(this)} onZoomOut={this.zoomOut.bind(this)} onMove={this.move.bind(this)} indicatorPosition={indicatorPosition} isZoomed={isZoomed} onRotate={this.handleRotate.bind(this)} />) || null
  }
}
