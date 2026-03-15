const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

// Initialize Scraping Cron Jobs
const initCronJobs = require('./cron/cronJobs');
initCronJobs();

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);
app.use(mongoSanitize());

// ─── Rate Limiter (global) ───────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use(globalLimiter);

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files for Document Uploads ───────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes")); // Admin Auth
app.use("/api/user", require("./routes/userAuthRoutes")); // User Auth
app.use("/api/schemes", require("./routes/schemeRoutes"));
app.use("/api/check-eligibility", require("./routes/eligibilityRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "SarkarSetu AI",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";
  console.error("[ERROR]", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 SarkarSetu AI Server running on port ${PORT}`);
  });
}

module.exports = app;
