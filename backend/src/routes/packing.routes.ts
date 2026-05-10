import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import addItem from "../modules/packing/addItem";
import toggleItem from "../modules/packing/toggleItem";
import deleteItem from "../modules/packing/deleteItem";

const router = Router();

router.post("/trips/:tripId/packing", authenticate, validate(["item_name"]), addItem);
router.patch("/packing/:id/toggle", authenticate, toggleItem);
router.delete("/packing/:id", authenticate, deleteItem);

export default router;
