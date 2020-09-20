import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CustomIcon = ({ size="2x", noHover=false, onClick, className, color="#f57167", defaultIcon="exclamation-circle", changeIcon="upload" }) => {
  const [icon, setIcon] = React.useState(defaultIcon)

  const onClickIcon = e => {
    e.stopPropagation()
    onClick && onClick()
  }

  return <button
    className={`w,h:50px bg:none ${className}`}
    onClick={onClickIcon}
    onMouseEnter={() => !noHover && setIcon(changeIcon) }
    onMouseLeave={() => !noHover && setIcon(defaultIcon) }
  >
    <FontAwesomeIcon size={size} icon={icon} color={color} />
  </button>
}

export default CustomIcon;