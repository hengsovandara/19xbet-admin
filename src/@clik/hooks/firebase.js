import firebase from "firebase";

export default !firebase.apps.length ? firebase.initializeApp({
  // databaseURL: "https://casa79-admin.firebaseio.com",
  // appId: "1:511327533280:web:84c11632cb6c42c0e1b885",
  apiKey: "AIzaSyCc6odlmpDKvfocsPfsGVkYNmfUoJAprXc",
  authDomain: "mwin-admin-a60ad.firebaseapp.com",
  projectId: "mwin-admin-a60ad",
  storageBucket: "mwin-admin-a60ad.appspot.com",
  messagingSenderId: "572080238922",
  measurementId: "G-BR2R8J5LF3"
}) : firebase.app()