import { Request, Response, NextFunction, Router } from "express";

export const pesanan: Router = Router();

type dummy = {
  nama: string;
  pesanan: string;
  hargaBeli: number;
};

const tumbal: Array<dummy> = [{ nama: "andi", pesanan: "Nasi Goreng", hargaBeli: 2000 }];

pesanan.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ status: 200, data: tumbal });
});

pesanan.post("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(req.body);
});

pesanan.delete("/:id", (req: Request, res: Response, Next: NextFunction) => {
  res.send(req.body);
});

pesanan.put("/:id", (req: Request, res: Response, Next: NextFunction) => {
  res.send(req.body);
});
