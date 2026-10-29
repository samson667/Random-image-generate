// Firebase SDK CDN লিংক ব্যবহার করা হলো
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);

// Messaging ইনস্ট্যান্স এক্সপোর্ট করা হলো
export const messaging = getMessaging(app);

// নোটিফিকেশন পারমিশন ও টোকেন নেওয়ার আপডেট করা ফাংশন
export async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      
      // সার্ভিস ওয়ার্কার ম্যানুয়ালি রেজিস্টার করে টোকেন পাওয়া নিশ্চিত করা
      const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        vapidKey: "BO0U4YIExcNkU67djM27Q4NcEMO_BP6-1s7yPzxY4LzyQeRcqGUsLW6BASB_RPqtVa56iAu-6r-qqZA-UwBPOpk",
        serviceWorkerRegistration: serviceWorkerRegistration // এটি সবচেয়ে গুরুত্বপূর্ণ!
      });

      console.log("FCM Device Token:", token);
      return token;
    } else {
      console.log("Notification permission rejected.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
}