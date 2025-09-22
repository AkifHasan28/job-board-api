import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jobRoutes from "./routes/jobs.js";

dotenv.config(); // must be first, before using process.env

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Board API is running 🚀");
});

app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
