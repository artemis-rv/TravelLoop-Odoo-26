import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import addActivity from "../modules/activity/addActivity";
import updateActivity from "../modules/activity/updateActivity";
import deleteActivity from "../modules/activity/deleteActivity";

const router = Router();

router.post("/stops/:stopId/activities", authenticate, validate(["title"]), addActivity);
router.put("/activities/:id", authenticate, updateActivity);
router.delete("/activities/:id", authenticate, deleteActivity);

export default router;
