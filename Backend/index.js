import express from 'express';
import cors from "cors";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import data_base from './atlas.js';
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


const app = express();
const PORT = process.env.PORT || 3000;

// মিডলওয়্যার
app.use(cors());
app.use(express.json()); // JSON ডাটা রিসিভ করার জন্য এটি জরুরি

// ফায়ারবেস অ্যাডমিন ইনিশিয়ালাইজেশন
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    // অ্যাপ আগে থেকে ইনিশিয়ালাইজ করা না থাকলে তবেই ইনিশিয়ালাইজ করবে
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is not set!");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

// ==========================================
// ১. টোকেন সেভ করার API রাউট (/api/save-token)
// ==========================================
app.post("/api/save-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const savedData = await data_base.create({ token: token });
    console.log("Token successfully saved to DB:", savedData);
    res.status(200).json({ 
      success: true, 
      message: "Token saved successfully with timestamp!" 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ 
        success: true, 
        message: "Token already exists in database." 
      });
    }
    console.error("Error saving token to DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// র্যান্ডম ইমেজ জেনারেট করার API
app.get("/api/image", (req, res) => {
  const id = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://picsum.photos/seed/${id}/900/600`;

  res.json({
    id: id,
    imageUrl: imageUrl
  });
});

// ==========================================
// ২. ম্যানুয়াল টোকেন ও মেসেজ দিয়ে নোটিফিকেশন পাঠানোর API
// ==========================================
app.post("/api/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).json({ error: "FCM token is required" });
  }

 // Backend notification payload structure
const message = {
  token: token,
  notification: {
    title: title,
    body: body,
  },
  data: {
    title: title,
    body: body,
    url: "https://random-photo-generate.netlify.app"
  },
  webpush: {
    headers: {
      Urgency: "high"
    },
    notification: {
      title: title,
      body: body,
      icon: "/favicon.ico",
      requireInteraction: true // Screen-e thakbe jotokhon na user dismiss korche
    }
  }
};

await admin.messaging().send(message);

  try {
    // এখানে সরাসরি getMessaging().send() ব্যবহার করা হয়েছে যা ES Module এ ১০০% কাজ করে
    const response = await getMessaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).json({ success: true, message: "Notification sent successfully", response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// হেলথ চেক API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// সার্ভার স্টার্ট
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});