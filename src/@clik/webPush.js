import 'firebase/messaging';
import firebase from  'firebase/app';
import localforage from  'localforage';

const firebaseConfig = {
  apiKey: "AIzaSyC3HRDZqta_5vIl3eprwtlisaoB5F4wrTQ",
  authDomain: "xbet-client.firebaseapp.com",
  projectId: "xbet-client",
  storageBucket: "xbet-client.appspot.com",
  messagingSenderId: "178374313428",
  appId: "1:178374313428:web:1dd13535fea68964714241",
  measurementId: "G-JJXKCWN0PW"
}

const firebaseCloudMessaging = {
  tokenInlocalforage: async () => {
    return localforage.getItem('fcm_token');
  },
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    try {
      console.log("weh push 1")
      const messaging = firebase.messaging();
      console.log("weh push 2")
      const status = await Notification.requestPermission();
      if (status && status ===  'granted') {
        console.log("weh push 3", messaging)
        const fcm_token = await messaging.getToken();
        console.log("weh push 4")
        console.log({fcm_token})
        if (fcm_token) {
          localforage.setItem( 'fcm_token', fcm_token);
          return fcm_token;
        }
      }
    } catch (error) {
      console.error("error error error", error);
      return null;
    }
  }
};
export { firebaseCloudMessaging };