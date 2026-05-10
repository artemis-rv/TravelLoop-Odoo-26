import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import tripRoutes from "./trip.routes";
import stopRoutes from "./stop.routes";
import activityRoutes from "./activity.routes";
import expenseRoutes from "./expense.routes";
import packingRoutes from "./packing.routes";
import noteRoutes from "./note.routes";
import sharedRoutes from "./shared.routes";
import searchRoutes from "./search.routes";

const router = Router();

// ─── Mount Routes ───────────────────────────────────
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/trips", tripRoutes);
router.use("/", stopRoutes);       // /trips/:tripId/stops & /stops/:id
router.use("/", activityRoutes);   // /stops/:stopId/activities & /activities/:id
router.use("/", expenseRoutes);    // /trips/:tripId/expenses & /expenses/:id
router.use("/", packingRoutes);    // /trips/:tripId/packing & /packing/:id
router.use("/", noteRoutes);       // /trips/:tripId/notes & /notes/:id
router.use("/", sharedRoutes);     // /trips/:tripId/share & /shared/:slug
router.use("/search", searchRoutes);

export default router;
