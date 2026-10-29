import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFAtsRQbXsbsc1h9pNyuaHU86IOYUi7Kk",
  authDomain: "random-photo-generate.firebaseapp.com",
  projectId: "random-photo-generate",
  storageBucket: "random-photo-generate.firebasestorage.app",
  messagingSenderId: "939615812907",
  appId: "1:939615812907:web:56203f571036bd9158996e",
  measurementId: "G-F8V6WMY6HY"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Explicit Service Worker Registration
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, {
        vapidKey: "BO0U4YIExcNkU67djM27Q4NcEMO_BP6-1s7yPzxY4LzyQeRcqGUsLW6BASB_RPqtVa56iAu-6r-qqZA-UwBPOpk",
        serviceWorkerRegistration: registration
      });

      console.log("FCM Device Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
}

// Foreground Listener (Tab open thakle jeno notification ashe)
onMessage(messaging, (payload) => {
  console.log("Foreground message received:", payload);
  const title = payload.notification?.title || "New Update";
  const body = payload.notification?.body || "";
  
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
});