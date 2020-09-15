import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { fustyle } from 'next-fucss/utils';

// components
export const Avatar = ({ url, size, status }) => {
  if (!url) {
    return <Icon className="dp:flx ai:c jc:c w,h:48px bd:1px-sd-sec br:50pc bg:sec c:white " icon="user" />
  }

  return (
    <Profile
      size={size}
      className="br:50pc bs:1 bg-ps:c-! bg-sz:cv-!" 
      style={{ backgroundImage: `url(${url})` }}
    >
      <Icon 
        icon="circle"
        className="w,h:100pc c:00d061 dp:flx jc:fe ai:fe" 
        style={{visibility: status !== 'online' && 'hidden'}} />
    </Profile>
  );
};

export const Icon = ({ icon, className, style, onClick }) => {
  return (
    <div className={className} style={style} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

export const Loading = () => {
  return <div className="w:100pc h:85pc dp:flx ai:c jc:c t:0">
    <span className="br:100pc w,h:40px bg-c:prim an:scaler-1s-inf-eio" />
  </div>
};

// styles
const Profile = styled.div`
  width: ${({ size = 40 }) => size + 'px'};
  height: ${({ size = 40 }) => size + 'px'};
`;
