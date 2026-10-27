import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./utils/seedData.js";

// Routes
import citizenRoutes from "./routes/citizen.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import grievanceRoutes from "./routes/grievance.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with credentials for cookies and client frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true, // Crucial for HttpOnly cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Standard parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes — all under /api so they don't clash with React frontend routes
app.use("/api/citizens", citizenRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/grievances", grievanceRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FixMyCity Civic Grievance API",
    timestamp: new Date().toISOString(),
  });
});

// In production, serve frontend build if it exists
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  // For any non-/api route, serve index.html so React Router handles it
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next(); // Let Express 404 handler respond
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // Root welcome in API-only mode
  app.get("/", (req, res) => {
    res.json({
      message: "🏛️ Welcome to FixMyCity API — Citizen Grievance & Civic Resolution Platform",
      endpoints: {
        auth: "/api/citizens/register, /api/citizens/login, /api/citizens/me, /api/citizens/logout",
        issues: "GET /api/issues, POST /api/issues, GET /api/issues/:id, POST /api/issues/:id/upvote",
        watchlist: "GET /api/watchlist, POST /api/watchlist/:issueId, DELETE /api/watchlist/:issueId",
        grievances: "POST /api/grievances/file, GET /api/grievances, GET /api/grievances/:id",
      },
    });
  });
}

// 404 Route Handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server & Connect Database
app.listen(PORT, async () => {
  console.log(`🚀 FixMyCity Backend Server running on http://localhost:${PORT}`);
  await connectDB();
  await seedDatabase();
});
