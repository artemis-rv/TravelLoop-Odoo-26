import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../../config/db";

const generateLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { expires_in_days } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { is_public: true },
    });

    const slug = crypto.randomBytes(8).toString("hex");

    const expires_at = expires_in_days
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    const shared = await prisma.sharedTrip.create({
      data: { trip_id: tripId, slug, expires_at },
    });

    res.status(201).json({
      shareLink: `/shared/${slug}`,
      slug: shared.slug,
      expires_at: shared.expires_at,
    });
  } catch (err) {
    next(err);
  }
};

export default generateLink;
