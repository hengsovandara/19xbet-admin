export const actions = ({ act, store, action, handle }) => ({
  CONNECT_COMETCHAT: () => {
    window.CometChat = require("@cometchat-pro/chat").CometChat;

    var appID = "977204141d997b";
    return Promise.resolve('Init cc')
    // CometChat.init(appID).then(action("LOGIN_COMETCHAT"), console.log);
  },

  LOGIN_COMETCHAT: async () => {
    const collaborators = await act("POST", {
      endpoint: "session",
      body: { collaborators: [{ type: "cometchat" }] }
    });
    const [cometchat = {}] = collaborators?.data?.collaborators || []
    return CometChat
      .login(cometchat.token)
      .then(user => store.set({ cometchatUser: user }), console.log);
  },

  // FETCH USER
  MESSENGER_FETCH_USERS: () => {
    const limit = 30;
    const usersRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();
    return usersRequest.fetchNext()
  },

  // MESSAGES
  SEND_MESSAGE: ({ receiverID, text }) => {
    const messageType = CometChat.MESSAGE_TYPE.TEXT;
    const receiverType = CometChat.RECEIVER_TYPE.USER;

    const textMessage = new CometChat.TextMessage(
      receiverID,
      text,
      messageType,
      receiverType
    );

    return CometChat.sendMessage(textMessage).then(
      message => message,
      error => console.log("Message sending failed with error:", error)
    );
  },

  RECEIVE_MESSAGES: (setConversations, conversations) => {
    const listenerID = "RECEIVE_MESSAGE_LISTENER";
    const messageListiner = new CometChat.MessageListener({
      onTextMessageReceived: textMessage => {
        setConversations([...conversations, textMessage]);
      },
      onMediaMessageReceived: mediaMessage => {},
      onCustomMessageReceived: customMessage => {}
    })
    return CometChat.addMessageListener(listenerID, messageListiner);
  },

  FETCH_MESSAGES_USER: ({ uid }) => {
    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(uid)
      .setLimit(limit)
      .build();

    return messagesRequest.fetchPrevious().then(
      messages => messages,
      error => console.log("Message fetching failed with error:", error)
    );
  },

  FETCH_ALL_MESSAGES: () => {
    const limit = 200;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setLimit(limit)
      .build();

    return messagesRequest.fetchPrevious().then(
      messages => messages,
      error => console.log("Message fetching failed with error:", error)
    );
  },

  // CALL

  INITIATE_CALL_WITH_USER: ({ uid, type, setSentCall }) => {
    window.CometChat = require("@cometchat-pro/chat").CometChat;

    var receiverID = uid;
    var callType =
      type === "video" ? CometChat.CALL_TYPE.VIDEO : CometChat.CALL_TYPE.AUDIO;
    var receiverType = CometChat.RECEIVER_TYPE.USER;

    var call = new CometChat.Call(receiverID, callType, receiverType);

    CometChat.initiateCall(call).then(
      outGoingCall => setSentCall(outGoingCall),
      error => console.log("Call initialization failed with exception:", error)
    );
  },

  RECEIVE_CALL_WITH_USER: ({
    setReceivedCall,
    setOutgoingCall,
    setIncomingCall,
    setCalling
  }) => {
    const listnerID = "CALL_LISTENER";

    // CometChat.addCallListener(
    //   listnerID,
    //   new CometChat.CallListener({
    //     onIncomingCallReceived(call) {
    //       setReceivedCall(call);
    //       setIncomingCall(true);
    //     },
    //     onOutgoingCallAccepted(call) {
    //       setCalling(true);
    //       setOutgoingCall(false);
    //       act("START_CALL", call);
    //     },
    //     onOutgoingCallRejected(call) {
    //       setOutgoingCall(false);
    //       setIncomingCall(false);
    //     },
    //     onIncomingCallCancelled(call) {
    //       setOutgoingCall(false);
    //       setIncomingCall(false);
    //     }
    //   })
    // );
  },

  START_CALL: call => {
    var sessionID = call.sessionId;

    CometChat.startCall(
      sessionID,
      document.getElementById("callScreen"),
      new CometChat.OngoingCallListener({
        onUserJoined: user => console.log("User joined call:", user),
        onUserLeft: user => console.log("User left call:", user),
        onCallEnded: call => console.log("Call ended:", call)
      })
    );
  },

  ACCEPT_CALL: call => {
    var sessionID = call.sessionId;

    CometChat.acceptCall(sessionID).then(
      call => act("START_CALL", call),
      error => console.log("Call acceptance failed with error", error)
    );
  },

  REJECT_CALL: ({ call, type }) => {
    var sessionID = call.sessionId;
    var status;

    switch (type) {
      case "rejected":
        status = CometChat.CALL_STATUS.REJECTED;
        break;
      case "cancelled":
        status = CometChat.CALL_STATUS.CANCELLED;
        break;
      case "busy":
        status = CometChat.CALL_STATUS.CANCELLED;
        break;
      default:
        throw new Error("Status type is undefined");
    }

    CometChat.rejectCall(sessionID, status).then(
      call => console.log("Call rejected successfully", call),
      error => console.log("Call rejection failed with error:", error)
    );
  },

  LISTEN_USER_STATUS: () => {
    const listenerID = "STATUS_LISTENER";

    CometChat.addUserListener(
      listenerID,
      new CometChat.UserListener({
        onUserOnline: onlineUser => console.log("On User Online:", { onlineUser }),
        onUserOffline: offlineUser => console.log("On User Offline:", { offlineUser })
      })
    );
  }
});
