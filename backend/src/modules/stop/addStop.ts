import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const addStop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { city_name, country, latitude, longitude, start_date, end_date } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const lastStop = await prisma.stop.findFirst({
      where: { trip_id: tripId },
      orderBy: { position: "desc" },
    });
    const position = lastStop ? lastStop.position + 1 : 0;

    const stop = await prisma.stop.create({
      data: {
        trip_id: tripId,
        city_name,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        position,
      },
    });

    res.status(201).json({ stop });
  } catch (err) {
    next(err);
  }
};

export default addStop;
