import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import addStop from "../modules/stop/addStop";
import updateStop from "../modules/stop/updateStop";
import deleteStop from "../modules/stop/deleteStop";
import reorderStops from "../modules/stop/reorderStops";

const router = Router();

router.post("/trips/:tripId/stops", authenticate, validate(["city_name"]), addStop);
router.put("/stops/:id", authenticate, updateStop);
router.delete("/stops/:id", authenticate, deleteStop);
router.put("/trips/:tripId/stops/reorder", authenticate, validate(["orderedIds"]), reorderStops);

export default router;
