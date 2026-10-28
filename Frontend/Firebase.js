// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// নোটিফিকেশন পারমিশন ও টোকেন নেওয়ার ফাংশন
export async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BO0U4YIExcNkU67djM27Q4NcEMO_BP6-1s7yPzxY4LzyQeRcqGUsLW6BASB_RPqtVa56iAu-6r-qqZA-UwBPOpk"
      });
      console.log("FCM Device Token:", token);
      
      // এই টোকেনটি আপনার Render ব্যাকএন্ডে পাঠাতে হবে (পরে দেখব)
      return token;
    } else {
      console.log("Notification permission rejected.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
}