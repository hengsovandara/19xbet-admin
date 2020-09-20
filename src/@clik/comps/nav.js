import Link from 'next/link';
import { withRouter } from 'next/router';
import Icon from 'clik/elems/icon'
import Button from 'clik/elems/button'
import { fucss } from 'next-fucss/utils';
import styled from "styled-components"

const ElemNav = (props) => (
  <div className={classNameNavigation(props.showNav)}>
    <div className={classNameLogout(props.showNav)}>
      <button className={classNameLogoutButton(props.showNav)} onClick={props.onToggleNavigation}>
        <Icon icon="bars" />
      </button>
    </div>
    <Navbar {...props} />
    <Footer {...props} />
  </div>
);


// broken image backup
function brokenImageBackup(ev){
  ev.target.src = 'https://i.imgur.com/Ut4LRBn.png'
}

const Navbar = ({ handleLogout, showNav, init, router, user, handleChangePicture }) => (
  <Nav className="w:100pc c:white dp:flx fd:col h:calc(100vh-140px) lg-h:calc(100vh-80px) of-y:auto ps:rl">
    <div className="w:100pc p-t:75px p-b:40px">
      <div className="dp:flx fd:col jc:c ai:c p-rl:12px">
        <div
          className={classNameImage(showNav)}
          onClick={handleChangePicture}
        >
          <div className="br:50pc dp:flx jc:c ai:c w,h:100pc ts:all profile-img bg:whitea05">
            {user && user.photo
              ? <img src={user.photo} onError={brokenImageBackup} className="br:50pc w,h:100pc" />
              : <Icon icon="user" size="2x" />
            }
          </div>
        </div>
        <div className="ta:c">
          <div className={classNameUsername(showNav)}>
            <Button className="td:n c:fff" link action={() => router.push(`/staff?id=${user.id}`)} text={user && user.name || 'Unknown'}/>
          </div>
        </div>
      </div>
    </div>

    <div className="w:100pc">
      {Object.values(init.routes).map(({ link, title, roles, icon, hide }) => {
        if (hide || (roles && !roles.includes(user?.role))) return null
        return (
          <div key={icon} className={classNameNavbar(router.pathname === link)}>
            <Link href={link}>
              <a className={classNameItem(showNav)}>
                <div className={classNameIcon(showNav)}><Icon icon={icon} solid={router.pathname === link} /></div>
                <div className={classNameTitle(showNav)}>{title}</div>
              </a>
            </Link>
          </div>
        )
      })}
      <div className={classNameNavbar()} onClick={handleLogout}>
        <a className={classNameItem(showNav)}>
          <div className={classNameIcon(showNav)}><Icon icon="power-off" /></div>
          <div className={classNameTitle(showNav)}>Log Out</div>
        </a>
      </div>
    </div>
  </Nav>
)

const Footer = ({ showNav, init }) => (
  <footer className={classNameFooter(showNav)}>
    {
      !showNav && (
        <div className="dp:flx ai:c">
          <div style={{ backgroundImage: `url('static/imgs/casa.png')` }} className="w:150px h:40px bg-sz:cover bg-ps:c op:0.7" />
          <div className="ta:l m-l:6px dp:n lg-dp:ib">
            <strong className="fs:60pc bg:prim br:3px p:2px-7px c:black">
              v{init.version} {init.env || ''}
            </strong>
          </div>
        </div>
      )
    }
  </footer>
);

const Nav = styled.nav`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const classNameNavigation = showNav => fucss({
  'bg:black ps:fx mnh:100vh z:6 w:70px ps:rl': true,
  'l:0': showNav,
  'l:70npx lg-l:0 lg-w:280px': !showNav,
});

const classNameFooter = showNav => fucss({
  'ps:fx b:0 c:white p:24px-12px dp:flx jc:c ai:c w:70px': true,
  'lg-w:280px': !showNav,
});

const classNameLogout = showNav => fucss({
  'ps:ab z:1 t:0 w,h:70px dp:flx ai,jc:c': true,
  'lgx-l:70px': !showNav,
  'lgx-l:0px': showNav
});

const classNameLogoutButton = showNav => fucss({
  'bg:ts fs:24px ts:all dp:flx flxw:wrap ai:c jc:c w:100pc hv-c:prim': true,
  'c:black lg-c:white': !showNav,
  'c:prim': showNav
});

const classNameImage = showNav => fucss({
  'w,h:50px m-b:12px dp:flx jc:c ai:c': true,
  'lg-w,h:75px': !showNav,
});

const classNameUsername = showNav => fucss({
  'm-tb:5px fs:60pc': true,
  'lg-fs:110pc': !showNav,
});

const classNameNavbar = active => fucss({
  'w:100pc hv-c:prim ts:all': true,
  'bd-l:4px-sd-prim bg:272727 c:prim': active,
  'bd-l:4px-sd-ts': !active,
});

const classNameItem = showNav => fucss({
  'w:100pc p:24px-5px': true,
  'lg-p:24px lg-dp:flx lg-ai:c': !showNav,
});

const classNameIcon = showNav => fucss({
  'm-b:5px': true,
  'lg-m-r:12px lg-m-b:0': !showNav,
});

const classNameTitle = showNav => fucss({
  'fs:60pc': true,
  'lg-fs:100pc': !showNav,
  'dp:n': showNav
});

export default withRouter(ElemNav)
