import { Router } from "express";
import authenticate from "../middleware/authenticate";
import generateLink from "../modules/shared/generateLink";
import getPublicTrip from "../modules/shared/getPublicTrip";

const router = Router();

router.post("/trips/:tripId/share", authenticate, generateLink);
router.get("/shared/:slug", getPublicTrip);

export default router;
