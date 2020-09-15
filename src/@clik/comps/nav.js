import Link from 'next/link';
import { withRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fucss } from 'next-fucss/utils';
import Particles from 'react-particles-js';
import { toCapitalize } from '../libs';

const ElemNav = props => (
  <div className={classNameNavigation(props.showNav)}>
    <div className={classNameParticles(props.showNav)}>
      <Particles
        className="h:100pc w:100pc op:0.25"
        params={{
          particles: {
            number: {
              value: 20
            },
            size: {
              value: 2,
              anim: {
                speed: 0,
                size_min: 0.3
              }
            },
            move: {
              random: true
            }
          }
        }}
      />
    </div>

    <div className={classNameLogout(props.showNav)}>
      <button className={classNameLogoutButton(props.showNav)} title={!props.showNav ? 'Log out' : undefined} onClick={props.handleLogout}>
        <FontAwesomeIcon icon="power-off" />
        {props.showNav && <span className={`w:100pc m-t:5px ${classNameTitle(props.showNav)}`}>Log out</span>}
      </button>
    </div>

    <Navbar {...props} />
    <Footer {...props} />
  </div>
);

const Navbar = ({ showNav, init, router, user, handleChangePicture }) => (
  <nav className="w:100pc c:white dp:flx fd:col h:calc(100vh-140px) lg-h:calc(100vh-80px) of-y:auto ps:rl">
    <div className="w:100pc p-tb:40px">
      <div className="dp:flx fd:col jc:c ai:c p-rl:10px">
        <div 
          className={classNameImage(showNav)} 
          onClick={handleChangePicture}
        >
          <div className="bd:3px-sd-prim br:50pc hv-try:2px dp:flx jc:c ai:c w,h:100pc ts:all profile-img">
            {user && user.photo
              ? <img src={user.photo} className="br:50pc w,h:100pc" />
              : <FontAwesomeIcon icon="user" />
            }
          </div>
        </div>
        <div className="ta:c">
          <div className={classNameUsername(showNav)}>
            <p className="username">{user && user.name || 'Unknown'}</p>
          </div>
            <div className={classNameRole(showNav)}>
              <p className="role">{user && toCapitalize(user.role) || 'Unknown role'}</p>
            </div>
        </div>
      </div>
    </div>

    <div className="w:100pc">
      {Object.values(init.routes).map(({ link, title, icon, hide }) => {
        if (hide) {
          return null;
        }

        return (
          <div key={icon} className={classNameNavbar(router.pathname === link)}>
            <Link href={link}>
              <a className={classNameItem(showNav)}>
                <div className={classNameIcon(showNav)}><FontAwesomeIcon icon={icon} /></div>
                <div className={classNameTitle(showNav)}>{title}</div>
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  </nav>
);

const Footer = ({ showNav, init }) => (
  <footer className={classNameFooter(showNav)}>
    <div className="dp:flx ai:c">
      <div style={{ backgroundImage: `url('static/imgs/logo-white.png')` }} className="w,h:40px bg-sz:cover bg-ps:c op:0.7" />
      {!showNav && (
        <div className="ta:l m-l:6px dp:n lg-dp:ib">
          <p className="mxw:200px fs:70pc fw:400 c:grey300">
            Clik Payment (Cambodia) Co. Ltd.
          </p>
          <strong className="fs:60pc bg:prim br:3px p:2px-7px">
            v{init.version} {init.env || ''}
          </strong>
        </div>
      )}
    </div>
  </footer>
);

const classNameNavigation = showNav => fucss({
  'bg:282828 ps:fx mnh:100vh z:3 w:70px of:hd ps:rl': true,
  'dp:bk lg-dp:bk': showNav,
  'dp:n lg-w:250px_dp:bk': !showNav,
});

const classNameParticles = showNav => fucss({
  'ps:ab h:100pc w:250px op:0': true,
  'lg-op:1': !showNav,
});

const classNameFooter = showNav => fucss({
  'ps:fx b:0 c:white p:20px-10px dp:flx jc:c ai:c w:70px': true,
  'lg-w:250px': !showNav,
});

const classNameLogout = showNav => fucss({
  'ps:ab l:0 z:1': true,
  'b:80px w:100pc bd-tb:1px-sd-333 p:10px-5px dp:flx jc:c ai:c': showNav,
  't:0 p:15px': !showNav,
});

const classNameLogoutButton = showNav => fucss({
  'bg:ts c:white fs:14px ts:all dp:flx flxw:wrap ai:c jc:c bd:2px-sd-ts w:100pc': true,
  'hv-c:prim': showNav,
  'hv-scl:1.05_bd:2px-sd-prim_br:50pc w,h:26px': !showNav,
});

const classNameImage = showNav => fucss({
  'w,h:50px m-b:6px dp:flx jc:c ai:c': true,
  'lg-w,h:75px': !showNav,
});

const classNameUsername = showNav => fucss({
  'm-tb:5px fw:600 c:prim300 fs:60pc': true,
  'lg-fs:110pc': !showNav,
});

const classNameRole = showNav => fucss({
  'fs:80pc fw:400 dp:n lg-dp:ib': true,
  'fs:60pc': showNav,
});

const classNameNavbar = active => fucss({
  'w:100pc hv-c:prim ts:all bd-t:1px-sd-333': true,
  'bd-l:2px-sd-prim bg:blacka5': active,
  'bd-l:2px-sd-ts': !active,
});

const classNameItem = showNav => fucss({
  'w:100pc p:20px-5px': true,
  'lg-p:20px lg-dp:flx lg-ai:c': !showNav,
});

const classNameIcon = showNav => fucss({
  'm-b:5px': true,
  'lg-m-r:10px lg-m-b:0': !showNav,
});

const classNameTitle = showNav => fucss({
  'fs:60pc fw:600': true,
  'lg-fs:100pc': !showNav
});

export default withRouter(ElemNav)
