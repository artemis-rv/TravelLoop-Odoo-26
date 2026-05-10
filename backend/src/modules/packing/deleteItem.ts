import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.packingItem.findUnique({
      where: { id },
      include: { trip: { select: { user_id: true } } },
    });
    if (!existing || existing.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Packing item not found." });
      return;
    }

    await prisma.packingItem.delete({ where: { id } });

    res.json({ message: "Packing item deleted." });
  } catch (err) {
    next(err);
  }
};

export default deleteItem;
