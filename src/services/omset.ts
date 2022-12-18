import { Router, Request, Response, NextFunction } from "express";

export const omset: Router = Router();

omset.get("/", (req: Request, res: Response, Next: NextFunction) => {
  res.send({ Total: 1000000 });
});
