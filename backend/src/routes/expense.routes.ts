import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";
import addExpense from "../modules/expense/addExpense";
import getExpenses from "../modules/expense/getExpenses";
import deleteExpense from "../modules/expense/deleteExpense";
import getBudgetSummary from "../modules/expense/getBudgetSummary";

const router = Router();

router.post("/trips/:tripId/expenses", authenticate, validate(["amount"]), addExpense);
router.get("/trips/:tripId/expenses", authenticate, getExpenses);
router.delete("/expenses/:id", authenticate, deleteExpense);
router.get("/trips/:tripId/budget-summary", authenticate, getBudgetSummary);

export default router;
