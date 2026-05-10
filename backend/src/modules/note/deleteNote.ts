import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.note.findUnique({
      where: { id },
      include: { trip: { select: { user_id: true } } },
    });
    if (!existing || existing.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    await prisma.note.delete({ where: { id } });

    res.json({ message: "Note deleted." });
  } catch (err) {
    next(err);
  }
};

export default deleteNote;
