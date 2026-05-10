import { Router } from "express";
import searchCities from "../modules/search/searchCities";
import searchActivities from "../modules/search/searchActivities";

const router = Router();

router.get("/cities", searchCities);
router.get("/activities", searchActivities);

export default router;
