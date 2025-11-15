// backend/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import storiesRouter from "./routes/stories.js";
import authRouter from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      mediaSrc: ["'self'", "blob:", "https://res.cloudinary.com"],
      // add other directives as needed
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes (mounted under /api)
app.use("/api/stories", storiesRouter);
app.use("/api/auth", authRouter);

// Health endpoint
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "web-stories-backend" })
);

const staticPath = path.join(process.cwd(), "frontend", "dist");
app.use(express.static(staticPath));

app.use((req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

const start = async () => {
  try {
    console.log(
      "Using DB env key:",
      process.env.MONGODB_URI ? "MONGODB_URI" : process.env.DB_URL ? "DB_URL" : process.env.MONGO_URI ? "MONGO_URI" : "none"
    );
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();

export default app;
