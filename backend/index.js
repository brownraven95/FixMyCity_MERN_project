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

// API Routes
app.use("/citizens", citizenRoutes);
app.use("/issues", issueRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/grievances", grievanceRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FixMyCity Civic Grievance API",
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get("/", (req, res) => {
  res.json({
    message: "🏛️ Welcome to FixMyCity API — Citizen Grievance & Civic Resolution Platform",
    endpoints: {
      auth: "/citizens/register, /citizens/login, /citizens/me, /citizens/logout",
      issues: "GET /issues (search, filter), POST /issues, GET /issues/:id, POST /issues/:id/upvote",
      watchlist: "GET /watchlist, POST /watchlist/:issueId, DELETE /watchlist/:issueId",
      grievances: "POST /grievances/file, GET /grievances, GET /grievances/:id",
    },
  });
});

// 404 Route Handler
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
