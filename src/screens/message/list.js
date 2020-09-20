import React, { Fragment } from 'react';
import styled from 'styled-components';
import { fustyle } from 'next-fucss/utils';
import { Paragraph } from '../../@clik/elems/styles';
import Search from '../../@clik/elems/table/search';
import { Avatar, Icon } from './comps';

export default ({ users, messages, setUser }) => {
  return (
    <Fragment>
      <div className="dp:flx jc:c w:100pc p:24px">
        <Paragraph className="fs:24px-! w:100pc">Messages</Paragraph>
        <Icon className="c:sec hv-c:prim m-r:24px" icon="pen" />
        <Icon className="c:sec hv-c:prim" icon="ellipsis-v" />
      </div>
      <div className="dp:flx jc:c w:100pc">
        <TabNavigation active={true}>
          <Paragraph center>Internal</Paragraph>
        </TabNavigation>
        <TabNavigation active={false}>
          <Paragraph center>Client</Paragraph>
        </TabNavigation>
      </div>
      <div className="p:24px">
        <Search />
      </div>
      <div className="of-y:scroll h:100pc p:24px p-t:0">
        {users && users.map(user => (
          <User 
            key={user.uid}
            uid={user.uid}
            avatar={user.avatar}
            name={user.name}
            status={user.status}
            messages={messages[user.uid]}
            onOpenChat={() => setUser(user)}
          />
        ))}
      </div>
    </Fragment>
  )
};

// components
const User = ({uid, avatar, name, status, messages, onOpenChat}) => {
  const lastMessage = messages && messages[messages.length - 1] && messages[messages.length - 1].text;
  const sentAt = messages && messages[messages.length - 1] && messages[messages.length - 1].sentAt;

  return (
    <div className="bd-b:1px-sd-e0e0e0a5" onClick={onOpenChat}>
      <div className="dp:flx p-tb:16px crs:pt">
        <div className="ta:l">
          <Avatar url={avatar} status={status} />
        </div>
        <div className="ta:l flxg:1 ai:c p-rl:12px as:c">
          <p className="fs:90pc fw:bold p-b:6px">{name}</p>
          {lastMessage && <p className="fs:90pc of:hidden">{smartTrim(lastMessage, 36, ' ...')}</p>}
        </div>
        {lastMessage && <div className="ta:r">
          <p className="fs:70pc">{timeSince(sentAt)}</p>
        </div>}
      </div>
    </div>
  );
};

const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 0 }
];

function timeSince(time) {
  if (!time) return;
  const seconds = Math.floor((Date.now() - time) / 1000);
  const interval = intervals.find(i => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}

function smartTrim(str, length, appendix) {
  if (str.length <= length) return str;
  const delim = ' ';
  let trimmedStr = str.substr(0, length + delim.length);

  var lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};


// styles
const TabNavigation = styled.div`
  ${fustyle('w:100pc bd-b:1px-sd-e0e0e0')};
  ${props => props.active && `
    border-bottom: 2px solid ${props.theme.prim};
  `};
`;
