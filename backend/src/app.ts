import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";

const app = express();

// ─── Global Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Docs ───────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── API Routes ─────────────────────────────────────
app.use("/api", routes);

// ─── Health Check ───────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Traveloop API is running" });
});

// ─── Error Handler ──────────────────────────────────
app.use(errorHandler);

export default app;
