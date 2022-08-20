import firebase from "firebase";

export default !firebase.apps.length ? firebase.initializeApp({
  // databaseURL: "https://casa79-admin.firebaseio.com",
  // appId: "1:511327533280:web:84c11632cb6c42c0e1b885",
  apiKey: "AIzaSyC3HRDZqta_5vIl3eprwtlisaoB5F4wrTQ",
  authDomain: "xbet-client.firebaseapp.com",
  projectId: "xbet-client",
  storageBucket: "xbet-client.appspot.com",
  messagingSenderId: "178374313428",
  appId: "1:178374313428:web:1dd13535fea68964714241",
  measurementId: "G-JJXKCWN0PW"
}) : firebase.app()