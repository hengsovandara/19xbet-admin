import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fustyle } from 'next-fucss/utils'
import styled from 'styled-components';
import useActStore from 'actstore';
import { actions } from './hooks';
import { Avatar, Icon, Loading } from './comps';
import { toCapitalize } from '../../@clik/libs';

const Chat = ({ user, onCall, onOpenAbout, onClose }) => {
  const { act, handle, init, cookies, store } = useActStore(actions);
  // const { users, messages } = store.get('users', 'messages');
  const bottomRef = useRef();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState();
  
  async function fetchConversation() {
    const convs = await act('FETCH_MESSAGES_USER', { uid: user.uid });
    act('RECEIVE_MESSAGES', setConversations, convs);
    setConversations(convs)
    setLoading();
  }

  useEffect(() => { 
    setLoading(true);
    fetchConversation();
  }, []);

  console.log({loading})

  useEffect(() => {
    bottomRef.current && bottomRef.current.scrollIntoView()
  }, [conversations])

  const onSendMessage = async (receiverID, text) => {
    const newMessage = await act('SEND_MESSAGE', { text, receiverID });
    setConversations([...conversations, newMessage]);
  }

  return (
    <div className="w,h:100pc dp:flx flxd:col">
      <div>
        <ChatHeader onClose={onClose} user={user} onCall={onCall} onOpenAbout={onOpenAbout} />
      </div>
      {loading && <Loading />}
      <div className="of-y:scroll dp:flx flxd:col h:100pc p-t:12px">
        {!!conversations && conversations.map(message => (
          <Message key={message.id} mine={message.sender.uid !== user.uid}>
            {message.text || 'Missed Call'}
          </Message>
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatTextArea onSubmit={msg => onSendMessage(user.uid, msg)} />
    </div>
  );
};

export default Chat;

const ChatHeader = ({ onClose, user, onCall, onOpenAbout }) => (
  <div className="p:24px dp:flx ai:c bd-b:1px-sd-e0e0e0">
    <Icon icon="arrow-left" onClick={onClose} />
    <div className="p-rl:12px">
      <Avatar url={user.avatar} />
    </div>
    <div className="w:100pc">
      <p className="fs:90pc fw:800 p-b:3px ta:l">{user.name}</p>
      <p className="c:prim ta:l fs:12px">{toCapitalize(user.status)}</p>
    </div>
    <div className="dp:flx jc:sb ai:c">
      <Icon icon="video" className="p:5px crs:pt" onClick={() => onCall('video')}  />
      <Icon icon="info-circle" className="p:5px crs:pt" onClick={onOpenAbout} />
    </div>
  </div>
)

const ChatTextArea = ({ onSubmit = console.log }) => {
  const textAreaRef = useRef();
  const [messageText, setMessageText] = useState();
  
  if (textAreaRef.current) {
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  }

  return (
    <div className="p:5px p-b:12px p-r:16px w:100pc">
      <form className="dp:flx ai:c js:sb" onSubmit={e => {
        e.preventDefault();
        if (!messageText || messageText.match(/^ *$/)) return;
        onSubmit(messageText);
        setMessageText();
      }}> 
        <Textarea
          ref={textAreaRef}
          placeholder="Type your message here" 
          rows="1"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
        />

        {!messageText && <Icon icon="paperclip" className="hv-bg:prim_c:white_bs:1_p-rl:12px ta:c bg:ts c:sec br:3px p-tb:8px ts:all" />}

        {messageText && <button type="submit" 
          className="ta:c bg:ts c:sec w,h:40px br:50pc p:0-12px hv-bg:prim_c:white_bs:2_try:1px ts:all">
          <FontAwesomeIcon icon="paper-plane" />
        </button>}
      </form>
    </div>
  );
};

const Message = styled.div`
  ${props => fustyle({ 
    'p-rl:14px m-rl:16px lh:1.5 p-tb:7px m-b:4px': true,
    'bg:6AC4BC c:white as:fs br:5px-5px-5px-0': !props.mine,
    'bg:e0e0e0 c:txt as:fe br:5px-5px-0-5px': props.mine
  })}
`;

const Textarea = styled.textarea`
  ${fustyle('w:100pc dp:flx jc:sb ai:c bg:white p:8px-12px fs:90pc ta:l br:3px mxh:74px m-rl:12px of-y:auto')};
  outline: none;
  border: 1px solid ${props => props.theme.borderColor};

  &:focus {
    box-shadow: 1px;
    border: 1px solid ${props => props.theme.prim};
  }
`;
