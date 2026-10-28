// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging"; // ১.Messaging ফাংশনগুলো ইমপোর্ট করা হলো

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFAtsRQbXsbsc1h9pNyuaHU86IOYUi7Kk",
  authDomain: "random-photo-generate.firebaseapp.com",
  projectId: "random-photo-generate",
  storageBucket: "random-photo-generate.firebasestorage.app",
  messagingSenderId: "939615812907",
  appId: "1:939615812907:web:56203f571036bd9158996e",
  measurementId: "G-F8V6WMY6HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ২. Messaging ইনিশিয়ালাইজ করা হলো যাতে getToken কাজ করতে পারে
export const messaging = getMessaging(app);

// নোটিফিকেশন পারমিশন ও টোকেন নেওয়ার ফাংশন
export async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BO0U4YIExcNkU67djM27Q4NcEMO_BP6-1s7yPzxY4LzyQeRcqGUsLW6BASB_RPqtVa56iAu-6r-qqZA-UwBPOpk"
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