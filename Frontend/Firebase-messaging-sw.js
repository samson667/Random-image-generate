import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Prokolper firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCFatsRQbXsbsc1h9PnyuaU86IOYUi7Kk",
  authDomain: "random-photo-generate.firebaseapp.com",
  projectId: "random-photo-generate",
  storageBucket: "random-photo-generate.firebasestorage.app",
  messagingSenderId: "939615812907",
  appId: "1:939615812907:web:56203f571036bd9158996e",
  measurementId: "G-F8V6WMY6HY"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Background message listener
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});