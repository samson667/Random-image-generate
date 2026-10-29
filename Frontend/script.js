import { messaging } from "./firebase.js";
import { onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";
import { requestPermission } from './firebase.js'; 

onMessage(messaging, async (payload) => {
  console.log("Foreground message:", payload);
  const reg = await navigator.serviceWorker.ready;
  reg.showNotification(payload.notification?.title || "PixelGlow", {
    body: payload.notification?.body || "",
    icon: '/favicon.ico'
  });
});

// ১. পেজ লোড হওয়ার সাথে সাথে সার্ভিস ওয়ার্কার রেজিস্টার করা বাধ্যতামূলক
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// (বাকি ইমেজ জেনারেশন এবং আগের কোডগুলো যেমন ছিল তেমনই থাকবে)



const API_URL = "https://random-image-generate-31c8.onrender.com/api/image";

const randomImage = document.getElementById("randomImage");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const imageInfo = document.getElementById("imageInfo");
const imageNumber = document.getElementById("imageNumber");
const newImageBtn = document.getElementById("newImageBtn");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");

let imgCount_local = localStorage.getItem("count_img_search");
let imageCount = imgCount_local ? Number(imgCount_local) : 0;
imageNumber.textContent = `#${String(imageCount).padStart(3, "0")}`;

async function loadRandomImage() {
  newImageBtn.disabled = true;
  buttonText.textContent = "Discovering...";
  errorMessage.textContent = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("The backend did not return a valid response.");
    }

    const data = await response.json();

    if (!data.imageUrl) {
      throw new Error("The backend did not provide an image URL.");
    }

    const image = new Image();

    image.onload = () => {
      randomImage.src = data.imageUrl;
      randomImage.hidden = false;
      imagePlaceholder.hidden = true;

      imageCount++;

      imageInfo.textContent = `Image #${data.id}`;
      imageNumber.textContent = `#${String(imageCount).padStart(3, "0")}`;

      newImageBtn.disabled = false;
      buttonText.textContent = "Generate New Image";

      localStorage.setItem("count_img_search", imageCount);
    };

    image.onerror = () => {
      errorMessage.textContent = "The image failed to load. Please try again.";
      newImageBtn.disabled = false;
      buttonText.textContent = "Try Again";
    };

    image.src = data.imageUrl;

  } catch (error) {
    console.error(error);
    errorMessage.textContent = "The server is no longer running.";
    newImageBtn.disabled = false;
    buttonText.textContent = "Try Again";
  }
}

if (newImageBtn) {
  newImageBtn.addEventListener("click", loadRandomImage);
}

// নোটিফিকেশন বাটন ক্লিক ইভেন্ট
const notifyBtn = document.getElementById("notifyBtn");

if (notifyBtn) {
  notifyBtn.addEventListener("click", async () => {
    console.log("Button clicked, requesting permission...");
    const token = await requestPermission();
    
    if (token) {
      console.log("Token successfully retrieved:", token);

      // পারমিশন পাওয়ার সাথে সাথেই ব্যাকএন্ডে পাঠিয়ে ডাটাবেসে সেভ করা
      try {
        const response = await fetch('https://random-image-generate-31c8.onrender.com/api/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: token })
        });

        const result = await response.json();
        console.log("Database save response:", result);
        
        if (result.success) {
          alert(" Notification is enable ");
        }
      } catch (error) {
        console.error("Error sending token to backend:", error);
      }
    }
  });
}