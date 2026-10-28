import express from 'express';
import cors from "cors";
import admin from "firebase-admin";
import data_base from './atlas.js';

const app = express();
const PORT = process.env.PORT || 3000;

// মিডলওয়্যার
app.use(cors());
app.use(express.json()); // JSON ডাটা রিসিভ করার জন্য এটি জরুরি

// ফায়ারবেস অ্যাডমিন ইনিশিয়ালাইজেশন (রেন্ডারের এনভায়রনমেন্ট ভেরিয়েবল থেকে কনফিগারেশন পড়ার জন্য)
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is not set!");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

// ==========================================
// ২. MongoDB কানেকশন ও স্কিমা সেটআপ
// ==========================================

// ==========================================
// ৩. টোকেন সেভ করার API রাউট (/api/save-token)
// ==========================================
app.post("/api/save-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // create() method দিয়ে ডাটাবেসে টোকেন ও টাইমস্ট্যাম্প সেভ করা
    const savedData = await data_base.create({ token: token });

    console.log("Token successfully saved to DB:", savedData);
    res.status(200).json({ 
      success: true, 
      message: "Token saved successfully with timestamp!" 
    });
  } catch (error) {
    // যদি একই টোকেন রিফ্রেশ করার কারণে বারবার আসে, তবে duplicate error (11000) হ্যান্ডেল করা
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

// নোটিফিকেশন পাঠানোর API (ফ্রন্টএন্ড বা অন্য কোথাও থেকে টোকেন আসলে এটি কাজ করবে)
app.post("/api/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).json({ error: "FCM token is required" });
  }

  const message = {
    notification: {
      title: title || "PixelGlow Notification",
      body: body || "আপনার জন্য নতুন একটি ছবি জেনারেট করা হয়েছে!"
    },
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
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