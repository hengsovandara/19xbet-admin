import React from 'react'
import Icon from '../elems/icon'
import { fucss } from 'next-fucss/utils'
import { toCapitalize } from '../libs'
import { useRouter } from 'next/router'

// broken image backup
function brokenImageBackup(ev){
  ev.target.src = 'https://i.imgur.com/Ut4LRBn.png'
}

const Header = ({ showNav, user, handleChangePicture, onToggleNavigation, title, ...props }) => {
  const router = useRouter()
  const onBack = props.onBack || router.back

  return (
    <header className={classNameContainer(showNav)}>
      <div className="dp:flx ai,jc:c">
        <button
          className={`menu ${classNameButton()}`}
          onClick={onBack}
        >
          <Icon icon="arrow-left" />
        </button>
        {/* {!!title && <h2 className={classNamesTitle()}>{title}</h2>} */}
      </div>
      <div className="dp:flx ai,jc:c">
        <div
          className={classNameImage()}
          onClick={handleChangePicture}
        >
          <div className="br:50pc dp:flx jc:c ai:c w,h:100pc ts:all profile-img bg:blacka06">
            {user && user.photo
              ? <img src={user.photo} onError={brokenImageBackup} className="br:50pc w,h:100pc" />
              : <Icon icon="user" />
            }
          </div>
        </div>
        <div className="ta:l">
          <div className={classNameUsername()}>
            <p className="username">{user && user.name || 'Unknown'}</p>
          </div>
          <div className={classNameRole()}>
            <p className="role">{user && toCapitalize(user.role) || 'Unknown role'}</p>
          </div>
        </div>
        <div className="bd-l:1px-sd-grey200 m-l:24px">
          <button
            className={classNameButton()}
            onClick={null}
            notification='true'
          >
            <Icon icon="bell" />
          </button>
        </div>
      </div>
    </header>
  )
};

const classNamesTitle = () => fucss({
  'ta:l p:32px dp:flx ai:c jc:sb c:prim': true
})

const classNameContainer = showNav => fucss({
  'z:5 dp:flx t,r:0 ai:c bg:fff bd-b:1px-sd-e5e5e5 ps:fx h:70px c:black200 jc:sb': true,
  'w:100pc lg-w:calc(100pc-280px) lgx-p-l:70px': showNav,
  'w:calc(100pc-70px)': !showNav,
});

const classNameButton = (open) => fucss({
  'w,h:70px bg:ts ts:bg fs:24px hv-c:prim_ts:all_svg': true,
  'c:prim': open,
  'c:black': !open,
  'h:50px': props => props.notification
});

const classNameImage = () => fucss({
  'w,h:40px dp:flx jc:c ai:c m-r:12px': true,
});

const classNameUsername = () => fucss({
  'c:black fw:600 fs:90pc': true,
});

const classNameRole = () => fucss({
  'fs:80pc fw:400 c:black100': true,
});

export default Header
