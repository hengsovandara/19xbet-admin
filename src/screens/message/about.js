import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Icon, Paragraph, Button } from '../../@clik/elems/styles';

const AboutUser = ({ user, onCloseAbout }) => {
  return (
    <Fragment>
      <div className="dp:flx ai:c p:24px">
        <Icon className="" onClick={onCloseAbout}>
          <FontAwesomeIcon icon="arrow-left" className="m-r:12px" />About
        </Icon>
        <div className="ta:c w:100pc">
          <Username>{user.name}</Username>
        </div>
      </div>
      <div className="p:24px">
        <div>
          <img src={user.avatar || "static/imgs/profile-small.jpg"} width="64px" height="64px" className="br:50pc bs:1" />
        </div>
      </div>
      <div className="">
        <div className="ta:l p:12px-24px">
          <Paragraph label="true">Loyalty Plan</Paragraph>
          <p>Pink Pussy</p>
        </div>
        <div className="ta:l p:12px-24px">
          <Paragraph label="true">Member Since</Paragraph>
          <p>November 15, 2019</p>
        </div>
        
        <Paragraph label="true" className="p:12px-24px">Privacy & Support</Paragraph>
        <ItemList>
          <div className="w:100pc">
            <Paragraph className="fw:normal-!">Notification</Paragraph>
          </div>
          <Icon>
            <FontAwesomeIcon icon="bell" />
          </Icon>
        </ItemList>
        <ItemList>
          <div className="w:100pc">
            <Paragraph className="fw:normal-!">Report Customer</Paragraph>
          </div>
          <Icon>
            <FontAwesomeIcon icon="exclamation-triangle" />
          </Icon>
        </ItemList>
        <ItemList>
          <div className="w:100pc">
            <Paragraph className="fw:normal-!">Block User</Paragraph>
          </div>
          <Icon>
            <FontAwesomeIcon icon="user-alt-slash" className="bg:ts" />
          </Icon>
        </ItemList>
      </div>
      <div className="ta:l p:12px-24px">
        <Paragraph label="true" className="p:12px-0">Notes</Paragraph>
        <Button>Add Notes</Button>
      </div>
    </Fragment>
  )
}

const Username = styled.p`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const ItemList = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 24px;

  &:hover {
    background: ${props => props.theme.borderColor};
  }
`;

export default AboutUser;
