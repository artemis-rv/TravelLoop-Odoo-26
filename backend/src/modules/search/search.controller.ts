import { Request, Response, NextFunction } from "express";
import * as searchService from "./search.service";

// ─── GET /api/search/cities?q=paris ─────────────────

export const getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || (q as string).trim().length < 2) {
      res.status(400).json({
        success: false,
        data: [],
        error: "Query parameter 'q' must be at least 2 characters.",
      });
      return;
    }

    const cities = await searchService.searchCities(q as string);

    res.json({ success: true, data: cities });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/search/activities?city=paris ───────────

export const getActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { city } = req.query;

    if (!city || (city as string).trim().length < 2) {
      res.status(400).json({
        success: false,
        data: [],
        error: "Query parameter 'city' is required (min 2 chars).",
      });
      return;
    }

    const activities = await searchService.searchActivities(city as string);

    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};
