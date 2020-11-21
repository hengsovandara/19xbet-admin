import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import Photo from '../photo'
import Preview from '../preview/'
import Button from '../button'

let photoMethods
let previewMethods

export default props => {
  const { value, edit, light, button, color = 'sec', icon = 'image', text } = props
  if (button) return <Button {...props} color={color} single text={text} icon={icon} type="file" action={props.action} />
  return (
    <div className="mdx-ta:c">
      {edit && (
        <span onClick={e => photoMethods && photoMethods.handleToggleShow()} key="new" className={classNameUpload(light)}>
          <FontAwesomeIcon icon="plus-circle" size="2x" />
        </span>
      )}
      {value &&
        value.map((img, i) => (
          <span key={i} className="ps:rl">
            {edit && (
              <span className={classNameDeleteImage(light)} onClick={e => props.action(img)}>
                <FontAwesomeIcon icon="times" />
              </span>
            )}
            <img src={img.url} className={classNameImage(light)} onClick={e => previewMethods.handleToggleShow(img)} />
            {img.description && <span className={classNameDesc()}>{img.description}</span>}
          </span>
        ))}
      <Photo popup getMethods={methods => (photoMethods = methods)} action={props.action} handleUserProfile={props.handleUserProfile}/>
      <Preview getMethods={methods => (previewMethods = methods)} />
    </div>
  )
}

const classNameDesc = edit =>
  fucss({
    'ps:ab b,l:0 w:calc(100pc-16px) z:1 bg:blacka5 m:5px p:12px-16px': !edit,
    'dp:bk bg:sec600 p:12px w:calc(100pc-5px)': edit
  })

const classNameUpload = light =>
  fucss({
    'h,lh:175px w:200px ta:c m:5px-5px-0-0 ai:c br:5px m-l:0 crs:pt ts:bs': true,
    'bg:tert bd:5px-sld-sec600': !light,
    'bg:grey100 bd:1px-sld-grey200 c:grey300 hv-bs:2': light
  })

const classNameImage = light =>
  fucss({
    'h:175px m:5px-5px-0-0 hv-bs:2 ts:all': true,
    'bd:5px-sld-sec600': !light,
    'bd:1px-sld-grey200': light
  })

const classNameDeleteImage = light =>
  fucss({
    't,r:0 ps:ab bs:1 hv-scl:1.5 z:1 ts:all h,w,lh:24px p:2px br:50pc ta:c crs:pt': true,
    'bg:sec600': !light,
    'bg:grey300 c:white': light
  })
