import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.trip.findFirst({
      where: { id, user_id: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    await prisma.trip.delete({ where: { id } });

    res.json({ message: "Trip deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export default deleteTrip;
