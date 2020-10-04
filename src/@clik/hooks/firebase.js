import firebase from "firebase";

export default !firebase.apps.length ? firebase.initializeApp({
  projectId: "casa79-admin",
  apiKey: 'AIzaSyBcYDVBNMP0ZZeQPO7XKmMcXQ5qffVXEoU',
  messagingSenderId: '511327533280',
  authDomain: "casa79-admin.firebaseapp.com",
  databaseURL: "https://casa79-admin.firebaseio.com",
  storageBucket: "casa79-admin.appspot.com",
  appId: "1:511327533280:web:84c11632cb6c42c0e1b885",
  measurementId: "G-BR2R8J5LF3"
}) : firebase.app()