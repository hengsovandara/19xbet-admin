import  'firebase/messaging';
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
      console.log("here")
      firebase.initializeApp(firebaseConfig);
    }

    try {
      const messaging = firebase.messaging();
      const tokenInLocalForage = await this.tokenInlocalforage();
      if (tokenInLocalForage !== null) return tokenInLocalForage;
      const status = await Notification.requestPermission();
      if (status && status ===  'granted') {
        const fcm_token = await messaging.getToken();
        if (fcm_token) {
          localforage.setItem( 'fcm_token', fcm_token);
          return fcm_token;
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
export { firebaseCloudMessaging };