import { Request, Response, NextFunction, Router } from "express";
import { insertPesanan, Ipesanan, Status, getPesanan, getPesananById, deletePesananById } from "../db/pesanan";
import { body, validationResult, oneOf } from "express-validator";
import { getDaftarMakanan } from "../db/daftarMakanan";

export const pesanan: Router = Router();

//TODO tumbal, deleted later
type dummy = {
  nama: string;
  pesanan: string;
  hargaBeli: number;
};

const tumbal: Array<dummy> = [{ nama: "andi", pesanan: "Nasi Goreng", hargaBeli: 2000 }];

//* Method Get
pesanan.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPesanan();

    res.status(200).send({ status: 200, msg: "ok", data: result });
  } catch (error) {
    res.status(500).send({ status: 500, msg: error, data: null });
  }
});

pesanan.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await getPesananById(req.params.id);

    if (result.status === 0) {
      return res.status(404).send({ status: 404, msg: result.msg, data: null });
    }

    res.status(200).send({ status: 200, msg: "ok", data: result });
  } catch (error) {
    res.status(500).send({ status: 500, msg: error, data: null });
  }
});

//* Method POST
pesanan.post(
  "/",
  body("nama").exists({ checkFalsy: true }), //* Validasi apakah semuanya kosong
  body("jenisPesanan").exists({ checkFalsy: true }),
  body("jumlah").exists({ checkFalsy: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //* Cek error, kalau ada, kirimkan pesan error
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send({ status: 404, msg: "some error has occured", errors: errors.array() }).status(404);
      }

      const { nama, jenisPesanan, jumlah }: Ipesanan = req.body;
      const daftarMakanan = await getDaftarMakanan();

      //* Cek apakah jenis pesanana ada di dalam daftar makanan
      if (!daftarMakanan.find((obj) => obj.nama === jenisPesanan)) {
        return res.send({ status: 404, msg: `${jenisPesanan} Tidak Ada di dalam menu`, errors: [{ field: "jenisPesanan", msg: "Tidak ada dalam menu" }] });
      }

      //* Masukan pesanan ke dalam database, lalu kirim pesan sukses
      const result: Status = await insertPesanan(nama, jenisPesanan, jumlah);

      res.status(200).send({ status: 200, msg: result });
    } catch (error) {
      //* Jika gagal, berarti error internal
      res.status(500).send({ status: 500, msg: error });
    }
  }
);

pesanan.delete("/:id", async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const result = await deletePesananById(req.params.id);
    if (result.status === 0) {
      return res.status(404).send({ status: 404, msg: result.msg });
    }
    res.status(200).send({ status: 200, msg: "ok" });
  } catch (error) {
    res.status(500).send({ status: 500, msg: error });
  }
});

pesanan.put("/:id", (req: Request, res: Response, Next: NextFunction) => {
  res.send(req.body);
});
