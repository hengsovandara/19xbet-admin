import { fucss } from 'next-fucss/utils'

const ZoomedImage = ({ fullWidth = false, url, disabled }) => {
  const [backgroundPosition, setBackgroundPosition] = React.useState(null)
  const ref = React.useRef()

  const zoomIn = e => {
    let x, y

    if(disabled) return

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

    const image = ref.current

    const posX = (image.naturalWidth / rect.width) * x
    const posY = (image.naturalHeight / rect.height) * y

    const cX = x - rect.width / 2
    const cY = y - rect.height / 2

    const bgX = -posX + (rect.width / 2 + cX)
    const bgY = -posY + (rect.height / 2 + cY)
    const position = [bgX + 'px', bgY + 'px'].join(' ')
    setBackgroundPosition(position)
  }

  const zoomOut = e => {
    if(disabled) return
    if (!(e.nativeEvent.touches && e.nativeEvent.touches[0])) {
      e.preventDefault()
      e.stopPropagation()
    }
    setBackgroundPosition(false)
  }

  return <div
    onMouseDown={e => zoomIn(e)}
    onMouseUp={zoomOut}
    onMouseMove={e => !!backgroundPosition && zoomIn(e)}
    onTouchStart={e => zoomIn(e)}
    onTouchEnd={zoomOut}
    onTouchMove={e => !!backgroundPosition && zoomIn(e)}
    className={classNameBackground(url, fullWidth, !!backgroundPosition)}
    style={{
      backgroundImage: `url(${url})`,
      backgroundPosition: backgroundPosition,
      transformOrigin: 'center'
    }}
  >
    <div className={classNameImage(backgroundPosition)} style={{ backgroundImage: `url(${url})` }} />
    <img ref={ref} style={{ position: 'absolute', zIndex: -1 }} src={url} />
  </div>
}

export default ZoomedImage

export const classNameBackground = (document, fullWidth, zoomed) => fucss({
  'w:100pc h:100pc bg-rp:nrp bg-pos:c crs:pnt ps:ab r:0 hv-l:0': true,
  'l:0': fullWidth,
  'l:50pc': !fullWidth,
  'bg-pos:l': !fullWidth && document,
  'ts:all': !zoomed
})

const classNameImage = hide => fucss({
  'w:100pc h:100pc bg-rp:nrp bg-pos:c bg-sz:cover': true,
  'op:0 crs:n': hide
})
