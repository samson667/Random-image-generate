
import express from 'express'
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

// Accept requests from a separate frontend
app.use(cors());

// The frontend will send requests to this API
app.get("/api/image", (req, res) => {

  // Generate a random ID
  const id = Math.floor(Math.random() * 1000000);

  // Create a new image URL using this ID
  const imageUrl = `https://picsum.photos/seed/${id}/900/600`;

  // Send a JSON response to the frontend
  res.json({
    id: id,
    imageUrl: imageUrl
  });
});

// API to check whether the backend is running properly
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
