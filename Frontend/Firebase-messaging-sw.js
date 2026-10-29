// Firebase App এবং Messaging এর Compat ভার্সন importScripts দিয়ে লোড করা হলো
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

// ব্যাকগ্রাউন্ড মেসেজ রিসিভ করা
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  
  const notificationTitle = payload.notification?.title || "PixelGlow Notification";
  const notificationOptions = {
    body: payload.notification?.body || "আপনার জন্য নতুন আপডেট এসেছে!",
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});