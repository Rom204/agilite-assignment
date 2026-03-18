import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index";

dotenv.config();

const app = express();

// Standard Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Simple Health Check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
