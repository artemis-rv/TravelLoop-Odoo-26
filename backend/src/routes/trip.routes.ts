import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import createTrip from "../modules/trip/createTrip";
import getTrips from "../modules/trip/getTrips";
import getTripById from "../modules/trip/getTripById";
import updateTrip from "../modules/trip/updateTrip";
import deleteTrip from "../modules/trip/deleteTrip";

const router = Router();

/**
 * @swagger
 * /trips:
 *   post:
 *     tags: [Trips]
 *     summary: Create a new trip
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Trip created }
 */
router.post("/", authenticate, validate(["title"]), createTrip);

/**
 * @swagger
 * /trips:
 *   get:
 *     tags: [Trips]
 *     summary: Get all user trips
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of trips }
 */
router.get("/", authenticate, getTrips);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Get trip by ID
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Trip details }
 */
router.get("/:id", authenticate, getTripById);

/**
 * @swagger
 * /trips/{id}:
 *   put:
 *     tags: [Trips]
 *     summary: Update a trip
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Trip updated }
 */
router.put("/:id", authenticate, updateTrip);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     tags: [Trips]
 *     summary: Delete a trip
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Trip deleted }
 */
router.delete("/:id", authenticate, deleteTrip);

export default router;
