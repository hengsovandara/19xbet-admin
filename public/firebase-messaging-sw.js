importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyC3HRDZqta_5vIl3eprwtlisaoB5F4wrTQ",
    authDomain: "xbet-client.firebaseapp.com",
    projectId: "xbet-client",
    storageBucket: "xbet-client.appspot.com",
    messagingSenderId: "178374313428",
    appId: "1:178374313428:web:1dd13535fea68964714241",
    measurementId: "G-JJXKCWN0PW"
  });

  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
}

self.addEventListener('fetch', (event) => {});
self.addEventListener('showNotification', (event) => {});