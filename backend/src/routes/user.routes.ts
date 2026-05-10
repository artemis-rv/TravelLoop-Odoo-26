import { Router } from "express";
import authenticate from "../middleware/authenticate";
import getProfile from "../modules/user/getProfile";
import updateProfile from "../modules/user/updateProfile";

const router = Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [User]
 *     summary: Get user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User profile }
 */
router.get("/profile", authenticate, getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile updated }
 */
router.put("/profile", authenticate, updateProfile);

export default router;
