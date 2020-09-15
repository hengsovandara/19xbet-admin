// import { CometChat } from "@cometchat-pro/chat";

export const actions = ({ act, store, action, handle }) => ({
  // INIT AND LOGIN
  CONNECT_COMETCHAT: () => {
    window.CometChat = require("@cometchat-pro/chat").CometChat;

    var appID = "977204141d997b";
    // console.log('connect')
    return CometChat.init(appID).then(action("LOGIN_COMETCHAT"), console.log);
  },

  LOGIN_COMETCHAT: async () => {
    const collaborators = await act("POST", {
      endpoint: "session",
      body: { collaborators: [{ type: "cometchat" }] }
    });
    const { data: { collaborators: [ cometchat ]} } = collaborators;
    return CometChat
      .login(cometchat.token)
      .then(user => store.set({ cometchatUser: user }), console.log);
  },

  // FETCH USER
  FETCH_USERS: () => {
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
      message => {
        console.log("Message sent successfully:", message);
        // Text Message Sent Successfully
        return message;
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );
  },

  RECEIVE_MESSAGES: (setConversations, conversations) => {
    const listenerID = "RECEIVE_MESSAGE_LISTENER";
    const messageListiner = new CometChat.MessageListener({
      onTextMessageReceived: textMessage => {
        console.log('GOT THE MESSAGE', textMessage, 'length => ' + conversations.length)
        setConversations([...conversations, textMessage]);
      },
      onMediaMessageReceived: mediaMessage => {
       console.log("Media message received successfully",  mediaMessage);
       // Handle media message
      },
       onCustomMessageReceived: customMessage => {
       console.log("Custom message received successfully",  customMessage);
       // Handle custom message
      }
       
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
      messages => {
        console.log("Message list fetched:", messages);
        // Handle the list of messages
        return messages;
      },
      error => {
        console.log("Message fetching failed with error:", error);
      }
    );
  },

  FETCH_ALL_MESSAGES: () => {
    const limit = 200;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setLimit(limit)
      .build();

    return messagesRequest.fetchPrevious().then(
      messages => {
        console.log("Message list fetched:", messages);
        // Handle the list of messages
        return messages
      },
      error => {
        console.log("Message fetching failed with error:", error);
      }
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
      outGoingCall => {
        console.log("Call initiated successfully:", outGoingCall);
        // perform action on success. Like show your calling screen.
        setSentCall(outGoingCall);
      },
      error => {
        console.log("Call initialization failed with exception:", error);
      }
    );
  },

  RECEIVE_CALL_WITH_USER: ({
    setReceivedCall,
    setOutgoingCall,
    setIncomingCall,
    setCalling
  }) => {
    const listnerID = "CALL_LISTENER";

    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived(call) {
          console.log("Incoming call:", call);
          // Handle incoming call
          setReceivedCall(call);
          setIncomingCall(true);
        },
        onOutgoingCallAccepted(call) {
          console.log("Outgoing call accepted:", call);
          // Outgoing Call Accepted
          setCalling(true);
          setOutgoingCall(false);
          act("START_CALL", call);
        },
        onOutgoingCallRejected(call) {
          console.log("Outgoing call rejected:", call);
          // Outgoing Call Rejected
          setOutgoingCall(false);
          setIncomingCall(false);
        },
        onIncomingCallCancelled(call) {
          console.log("Incoming call calcelled:", call);
          setOutgoingCall(false);
          setIncomingCall(false);
        }
      })
    );
  },

  START_CALL: call => {
    var sessionID = call.sessionId;

    CometChat.startCall(
      sessionID,
      document.getElementById("callScreen"),
      new CometChat.OngoingCallListener({
        onUserJoined: user => {
          /* Notification received here if another user joins the call. */
          console.log("User joined call:", user);
          /* this method can be use to display message or perform any actions if someone joining the call */
        },
        onUserLeft: user => {
          /* Notification received here if another user left the call. */
          console.log("User left call:", user);
          /* this method can be use to display message or perform any actions if someone leaving the call */
        },
        onCallEnded: call => {
          /* Notification received here if current ongoing call is ended. */
          console.log("Call ended:", call);
          /* hiding/closing the call screen can be done here. */
        }
      })
    );
  },

  ACCEPT_CALL: call => {
    var sessionID = call.sessionId;

    CometChat.acceptCall(sessionID).then(
      call => {
        console.log("Call accepted successfully:", call);
        // start the call using the startCall() method
        act("START_CALL", call);
      },
      error => {
        console.log("Call acceptance failed with error", error);
        // handle exception
      }
    );
  },

  REJECT_CALL: ({ call, type }) => {
    // return console.log(call, type)
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
      call => {
        console.log("Call rejected successfully", call);
      },
      error => {
        console.log("Call rejection failed with error:", error);
      }
    );
  },

  LISTEN_USER_STATUS: () => {
    const listenerID = "STATUS_LISTENER";

    CometChat.addUserListener(
      listenerID,
      new CometChat.UserListener({
        onUserOnline: onlineUser => {
          /* when someuser/friend comes online, user will be received here */
          console.log("On User Online:", { onlineUser });
        },
        onUserOffline: offlineUser => {
          /* when someuser/friend went offline, user will be received here */
          console.log("On User Offline:", { offlineUser });
        }
      })
    );
  }
});