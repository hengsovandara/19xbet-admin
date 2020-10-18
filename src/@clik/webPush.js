import 'firebase/messaging';
import firebase from  'firebase/app';
import localforage from  'localforage';

const firebaseConfig = {
  projectId: "casa79-admin",
  apiKey: 'AIzaSyBcYDVBNMP0ZZeQPO7XKmMcXQ5qffVXEoU',
  messagingSenderId: '511327533280',
  authDomain: "casa79-admin.firebaseapp.com",
  databaseURL: "https://casa79-admin.firebaseio.com",
  storageBucket: "casa79-admin.appspot.com",
  appId: "1:511327533280:web:84c11632cb6c42c0e1b885",
  measurementId: "G-BR2R8J5LF3"
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