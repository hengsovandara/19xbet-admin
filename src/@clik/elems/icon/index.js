import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
  console.log("props.icon", props.icon)
  return (
    props.type === 'clik'
      ? <Img {...props} src={`/static/imgs/${props.icon}.svg`} />
      : <FontAwesomeIcon {...props} alt={props.alt} icon={props.icon} />
  )

}

const Img = styled.img`
  color: ${props => props.color && !props.color.includes('#') ? props.theme.colors[props.color] : props.color};
`
