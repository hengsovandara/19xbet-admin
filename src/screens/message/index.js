import React, { useState, useEffect } from 'react'
import useActStore from 'actstore'
import ListUser from './list'
import Chat from './chat'
import AboutUser from './about'
import { actions } from './hooks'

const Message = ({ setCalling }) => {
  const { act, handle, init, cookies, store } = useActStore(actions, ['users', 'messages'])
  const { users, messages } = store.get('users', 'messages')

  const [showAbout, setShowAbout] = useState()
  const [user, setUser] = useState()
  const [receivedCall, setReceivedCall] = useState()
  const [sentCall, setSentCall] = useState()

  const [incomingCall, setIncomingCall] = useState()
  const [outgoingCall, setOutgoingCall] = useState()

  // useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const me = await act('CONNECT_COMETCHAT')

    // await Promise.all([
    //   act('FETCH_ALL_MESSAGES')
    //     .then(messages => messages.reduce((obj, message) => addMessageToConversation(obj, message, me.cometchatUser.uid), {})),
    //   act('MESSENGER_FETCH_USERS')
    // ]).then(([ messages, users]) => {
    //   const userIds = Object.keys(messages)
    //   users = users.filter(user => user.status === 'online' || userIds.includes(user.uid))
    //   return { users, messages }
    // })
    // .then(({users, messages}) => store.set({ users, messages }))
    // .then(console.log)
  }

  useEffect(() => {
    act('RECEIVE_CALL_WITH_USER', { setReceivedCall, setOutgoingCall, setIncomingCall, setCalling })
  })

  return null

  const addMessageToConversation = (conversations, message, userId) => {
    const iAmSender = userId ? userId === message.receiver : true
    const key = iAmSender ? message.sender.uid : message.receiver
    conversations[key] = (conversations[key] || []).concat({
      ...message,
      me: iAmSender && message.text,
      you: !iAmSender && message.text,
      time: message.sentAt
    })
    return conversations
  }

  const onCall = type => {
    setOutgoingCall(true)
    act('INITIATE_CALL_WITH_USER', { uid: user.uid, type, setSentCall })
  }

  const showOutgoingCall = () => (
    <div className="w:370px bg:white bs:1npx-1px-16px-e0e0e0 op:1 br:5px m-r:24px">
      <OutgoingCall recipient={user} onCancelCall={() => {
        act('REJECT_CALL', { call: sentCall, type: 'cancelled' })
        setOutgoingCall(false)
      }} />
    </div>
  )

  const showIncomingCall = () => (
    <div className="w:370px bg:white bs:1npx-1px-16px-e0e0e0 op:1 br:5px m-r:24px">
      <IncomingCall
        sender={receivedCall.sender}
        onAcceptCall={() => {
          act('ACCEPT_CALL', receivedCall)
          setIncomingCall(false)
          setCalling(true)
        }}
        onRejectCall={() => {
          act('REJECT_CALL', { call: receivedCall, type: 'rejected' })
          setIncomingCall(false)
        }}
      />
    </div>
  )

  if (incomingCall) {
    return showIncomingCall()
  }

  if (outgoingCall) {
    return showOutgoingCall()
  }

  return (
    <div className="bg:white bs:1npx-1px-16px-e0e0e0 op:1 w:400px h:100pc">
      {users && !user && <ListUser users={users} messages={messages} setUser={setUser} />}
      {user && showAbout && <AboutUser user={user} onCloseAbout={() => setShowAbout(false)} />}
      {user && !showAbout && <Chat user={user} onCall={onCall} onClose={() => setUser()} onOpenAbout={() => setShowAbout(true)} />}
    </div>
  )
}

export default Message

export const IncomingCall = ({ sender, onAcceptCall, onRejectCall }) => (
  <div className="dp:flx w:100pc p:24px">
    <div className="w:100pc dp:flx">
      <div className="ta:l m-r:24px">
        <img src={"static/imgs/profile-small.jpg"} width="48px" height="48px" className="br:50pc bs:1" />
      </div>
      <div>
        <p className="fs:14px fw:bold ta:left p-b:6px">{sender.name}</p>
        <p className="c:prim ta:l fs:12px">Incoming call</p>
      </div>
    </div>
    <div className="dp:flx jc:fe ai:c">
      <button type="button" onClick={onAcceptCall} className="bg:00d061 m-r:12px c:white bd:1px-sd-white br:50pc bs:1 w,h:48px">
        <FontAwesomeIcon icon="phone-alt" />
      </button>
      <button type="button" onClick={onRejectCall} className="bg:f57167 c:white bd:1px-sd-white br:50pc bs:1 w,h:48px">
        <FontAwesomeIcon icon="phone-slash" />
      </button>
    </div>
  </div>
)

export const OutgoingCall = ({ recipient, onCancelCall }) => (
  <div className="dp:flx w:100pc p:24px">
    <div className="w:100pc dp:flx">
      <div className="ta:l m-r:24px">
        <img src={"/static/imgs/profile-small.jpg"} width="48px" height="48px" className="br:50pc bs:1" />
      </div>
      <div>
        <p className="fs:14px fw:bold ta:left p-b:6px">{recipient.name}</p>
        <p className="c:prim ta:l fs:12px">Outgoing call</p>
      </div>
    </div>
    <div className="ta:r">
      <button type="button" onClick={onCancelCall} className="bg:f57167 c:white bd:1px-sd-white br:50pc bs:1 w,h:48px">
        <FontAwesomeIcon icon="phone-slash" />
      </button>
    </div>
  </div>
)
