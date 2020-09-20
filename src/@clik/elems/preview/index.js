import { Component } from 'react'
import ZoomImage from './preview'
import { rotateImage } from './rotate'

let imageBG
let image

const onImageBgRef = ref => { imageBG = ref }
const onImageRef = ref => { image = ref }

const Preview = ({getMethods}) => {
  const [show, setShow] = React.useState(false)
  const [img, setImg] = React.useState()
  const [isVdo, setIsVdo] = React.useState()
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [backgroundPosition, setBackgroundPosition] = React.useState(null)
  const [backgroundSize, setBackgroundSize] = React.useState(null)
  const [deg, setDeg] = React.useState(null)
  const [rTop, setRTop] = React.useState(0)
  const [rRight, setRRight] = React.useState(0)
  const [rBottom, setRBottom] = React.useState(null)
  const [rLeft, setRLeft] = React.useState(null)
  const [fTop, setFTop] = React.useState(null)
  const [fRight, setFRight] = React.useState(0)
  const [fBottom, setFBottom] = React.useState(0)
  const [fLeft, setFLeft] = React.useState(null)
  const [indicatorPosition, setIndicatorPosition] = React.useState({})

  const zoomIn = e => {
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

    setIsZoomed(true)
    setBackgroundPosition([bgX + 'px', bgY + 'px'].join(' '))
  }

  const handleToggleShow = (img, isVdo = false) => {
    setShow(!show)
    setImg(img)
    setIsVdo(isVdo)
  }

  React.useEffect(() => {
    getMethods && getMethods({ handleToggleShow })
  }, [])

  const handleFullscreen = e => {
    e.preventDefault()
    e.stopPropagation()
    setIsFullscreen(!isFullscreen)
    return false
  }

  const move = e => {
    const rect = e.target.getBoundingClientRect()

    const width = rect.width / 2
    const height = rect.height / 2

    const x = e.clientX - rect.left - width / 2
    const y = e.clientY - rect.top - height / 2

    setIndicatorPosition({ x, y, height, width })
  }

  const zoomOut = e => {
    if (!(e.nativeEvent.touches && e.nativeEvent.touches[0])) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsZoomed(false)
  }

  const handleRotate = e => {
    let deg = deg + 90

    if (deg === 360) deg = 0

    const { rTop, rRight, rBottom, rLeft, fTop, fRight, fBottom, fLeft } = rotateImage(deg)

    setDeg(deg)
    setRTop(rTop)
    setRRight(rRight)
    setRBottom(rBottom)
    setRLeft(rLeft)
    setFTop(fTop)
    setFRight(fRight)
    setFBottom(fBottom)
    setFLeft(fLeft)

    e.preventDefault()
    e.stopPropagation()
  }

  return (show &&
    <ZoomImage
      show={show} isVdo={isVdo} isFullscreen={isFullscreen}
      backgroundPosition={backgroundPosition} backgroundSize={backgroundSize} indicatorPosition={indicatorPosition}
      deg={deg} rTop={rTop} rRight={rRight} rBottom={rBottom}
      rLeft={rLeft} fTop={fTop} fRight={fRight} fBottom={fBottom} fLeft={fLeft}
      image={img} isZoomed={isZoomed}
      onImageBgRef={onImageBgRef}
      onImageRef={onImageRef}
      onFullscreen={handleFullscreen}
      onToggleShow={handleToggleShow}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onMove={move}
      onRotate={handleRotate} />
  ) || null
}

export default Preview
