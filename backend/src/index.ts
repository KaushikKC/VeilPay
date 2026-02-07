import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { proofRouter } from "./api/proofs";
import { commitmentRouter } from "./api/commitments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "zk-credentials-backend" });
});

// API routes
app.use("/api/proofs", proofRouter);
app.use("/api/commitments", commitmentRouter);

app.listen(PORT, () => {
  console.log(`ZK-Credentials backend running on port ${PORT}`);
});

export default app;
