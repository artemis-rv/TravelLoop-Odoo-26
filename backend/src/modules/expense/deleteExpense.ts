import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.expense.findUnique({
      where: { id },
      include: { trip: { select: { user_id: true } } },
    });
    if (!existing || existing.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Expense not found." });
      return;
    }

    await prisma.expense.delete({ where: { id } });

    res.json({ message: "Expense deleted." });
  } catch (err) {
    next(err);
  }
};

export default deleteExpense;
