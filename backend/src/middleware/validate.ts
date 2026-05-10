import { Request, Response, NextFunction } from "express";

const validate = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
      return;
    }

    next();
  };
};

export default validate;
