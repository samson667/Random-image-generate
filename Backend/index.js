
import express from 'express'
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

// আলাদা frontend থেকে request গ্রহণ করার জন্য
app.use(cors());

// Frontend এই API-তে request পাঠাবে
app.get("/api/image", (req, res) => {

  // একটি random ID তৈরি হচ্ছে
  const id = Math.floor(Math.random() * 1000000);

  // এই ID ব্যবহার করে নতুন image URL তৈরি হচ্ছে
  const imageUrl = `https://picsum.photos/seed/${id}/900/600`;

  // Frontend-কে JSON response পাঠাচ্ছি
  res.json({
    id: id,
    imageUrl: imageUrl
  });
});

// Backend ঠিকমতো চলছে কি না পরীক্ষা করার API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Server চালু করছি
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
