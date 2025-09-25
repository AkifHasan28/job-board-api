import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jobRoutes from "./routes/jobs.js";
import authRoutes from "./routes/auth.js";


dotenv.config(); // must be first, before using process.env

const app = express();
// app.use(express.json());

app.use(express.json());

// basic health and root endpoints
app.get("/", (_req, res) => {
  res.send("Job Board API is running 🚀");
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// routes
app.use("/jobs", jobRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

// Connect + start server
(async () => {
  try {
    // Mongoose 7+ doesn't need useNewUrlParser/useUnifiedTopology
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown (Render sends SIGTERM on redeploy/scale down)
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received: closing HTTP server and Mongo connection");
      server.close(async () => {
        await mongoose.connection.close();
        console.log("Mongo connection closed. Bye!");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
})();
