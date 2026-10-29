importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCFatsRQbXsbsc1h9PnyuaU86IOYUi7Kk",
  authDomain: "random-photo-generate.firebaseapp.com",
  projectId: "random-photo-generate",
  storageBucket: "random-photo-generate.firebasestorage.app",
  messagingSenderId: "939615812907",
  appId: "1:939615812907:web:56203f571036bd9158996e",
  measurementId: "G-F8V6WMY6HY"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message: ', payload);

  const title = payload.notification?.title || payload.data?.title || "New Message";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };

  self.registration.showNotification(title, options);
});