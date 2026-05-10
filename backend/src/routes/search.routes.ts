import { Router } from "express";
import { getCities, getActivities } from "../modules/search/search.controller";

const router = Router();

/**
 * @swagger
 * /search/cities:
 *   get:
 *     summary: Search cities by name (autocomplete)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to search (min 2 chars)
 *     responses:
 *       200:
 *         description: List of matching cities
 */
router.get("/cities", getCities);

/**
 * @swagger
 * /search/activities:
 *   get:
 *     summary: Search tourist activities by city name
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to search activities for
 *     responses:
 *       200:
 *         description: List of tourist activities
 */
router.get("/activities", getActivities);

export default router;
