import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fucss } from 'next-fucss/utils';
import Message from '../../screens/message';

const Header = ({ showNav, title, onToggleNavigation }) => {
  const [open, setOpen] = useState(false);
  const [calling, setCalling] = useState(false);

  return (
    <header className={classNameContainer(showNav)}>
      <div key="1">
        <button 
          className={`menu ${classNameButton()}`}
          onClick={onToggleNavigation}
        >
          <FontAwesomeIcon icon="bars" />
        </button>
      </div>
      <div className="100pc">
        <h3 className="mdx-fs:90pc fw:600 header-title">{title}</h3>
      </div>
      <div key="2" className="ps:rl">
        <button 
          className={`menu ${classNameButton(open)}`}
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon="envelope" />
        </button>
        <div className="bg:red ps:ab t:0px r:7px h,lh:16px p-rl:4px br:5px c:white fs:10px fw:600">
          8
        </div>
        <div className={classNameWrap(open)}>
          {calling && <div id="callScreen" className="h:100vh ps:fx z:999 w:100pc t,l:0"></div>}
          <Message setCalling={setCalling} />
        </div>
      </div>
    </header>
  )
};

const classNameContainer = showNav => fucss({
  'z:5 dp:flx jc:sb t,r:0 ai:c bg:fff bd-b:1px-sd-e5e5e5 ps:fx h:55px c:sec': true,
  'w:100pc lg-w:calc(100pc-250px)': showNav,
  'w:calc(100pc-70px)': !showNav,
});

const classNameButton = open => fucss({
  'p:8px-15px br:5px bg:ts ts:bg hv-c:prim_ts:all_svg': true,
  'c:prim': open,
  'c:sec': !open
});

const classNameWrap = open => fucss({
  'ps:fx h:calc(100vh-55px) b,r:0 ts:all': true,
  'trl:100pc': !open
});

export default Header;
