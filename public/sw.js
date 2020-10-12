importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-messaging.js');

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: "casa79-admin",
    apiKey: 'AIzaSyBcYDVBNMP0ZZeQPO7XKmMcXQ5qffVXEoU',
    messagingSenderId: '511327533280',
    appId: "1:511327533280:web:84c11632cb6c42c0e1b885",
  });
  // firebase.messaging.onMessage((message) => {
  //   console.log({message})
  // })
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