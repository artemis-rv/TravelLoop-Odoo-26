import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import addNote from "../modules/note/addNote";
import getNotes from "../modules/note/getNotes";
import deleteNote from "../modules/note/deleteNote";

const router = Router();

router.post("/trips/:tripId/notes", authenticate, validate(["content"]), addNote);
router.get("/trips/:tripId/notes", authenticate, getNotes);
router.delete("/notes/:id", authenticate, deleteNote);

export default router;
