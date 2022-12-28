import { Request, Response, NextFunction, Router } from "express";
import { insertPesanan, Ipesanan, Status } from "../db/pesanan";
import { body, validationResult, oneOf } from "express-validator";
import { globalData, globalDaftarMakanan } from "../db/daftarMakanan";

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

pesanan.post(
  "/",
  body("nama").exists({ checkFalsy: true }),
  body("jenisPesanan").exists({ checkFalsy: true }).isIn(globalDaftarMakanan),
  body("jumlah").exists({ checkFalsy: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ status: 404, msg: "some error has occured", errors: errors.array() }).status(404);
    }

    const { nama, jenisPesanan, jumlah }: Ipesanan = req.body;
    let harga = globalData.find((daftarMakanan) => daftarMakanan.nama === jenisPesanan)?.harga as number;
    harga = harga * jumlah;

    const result: Status = await insertPesanan(nama, jenisPesanan, jumlah, harga);

    res.send(result);
  }
);

pesanan.delete("/:id", (req: Request, res: Response, Next: NextFunction) => {
  res.send(req.body);
});

pesanan.put("/:id", (req: Request, res: Response, Next: NextFunction) => {
  res.send(req.body);
});
