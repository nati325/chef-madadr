// server/app.js
console.log("Starting server...");
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// --- קובץ .env ---
dotenv.config(); // כדי לקרוא MONGO_URI ו־PORT

// --- ראוטרים ---
import userRoutes from "./routes/userRouter.js";
import recipeRoutes from "./routes/recipeRouter.js";
import courseRoutes from "./routes/courseRouter.js";
import adminRoutes from "./routes/adminRouter.js";
import appointmentRoutes from "./routes/ApoitmentRouter.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Simple request logger to help debug 404s from Postman
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);

  // For debugging registration/login issues: log headers and body for user POSTs
  if (req.method === "POST" && req.originalUrl.startsWith("/api/users")) {
    try {
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
    } catch (e) {
      console.log("Error logging request body:", e.message);
    }
  }

  next();
});

// Log response status after request finishes
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(new Date().toISOString(), "RESPONSE", req.method, req.originalUrl, "->", res.statusCode);
  });
  next();
});

// --- ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRouter);


// Root route - friendly message so visiting http://localhost:5000 doesn't return 404
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API. Available routes: /api/users, /api/recipes, /api/courses",
  });
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- חיבור למונגו + הרצת שרת באותו קובץ ❤ ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/project";
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected to:", MONGO_URI);

    // Print registered routes to help debug 404 issues (optional)
    // Commenting out to avoid startup errors
    /*
    try {
      const routes = [];
      app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
          const methods = Object.keys(r.route.methods).join(",").toUpperCase();
          routes.push(`${methods} ${r.route.path}`);
        }
      });
      console.log("Registered routes:\n", routes.join("\n"));
    } catch (e) {
      console.log("Could not enumerate routes:", e.message);
    }
    */

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });