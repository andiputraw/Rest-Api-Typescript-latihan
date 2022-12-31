import { Request, Response, NextFunction, Router } from "express";
import { insertPesanan, Ipesanan, Status, getPesanan, getPesananById, deletePesananById, updatePesanan } from "../db/pesanan";
import { body, validationResult, oneOf } from "express-validator";
import { getDaftarMakanan } from "../db/daftarMakanan";
import { customError, isACustomError } from "../Types";

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
    if (isACustomError(error)) {
      if (error.error === "client") return res.status(404).send({ status: 400, msg: error.msg, details: error.details });
      return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
    }
    return res.status(500).send({ status: 500, msg: error, details: { server: "server error" } });
  }
});

pesanan.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await getPesananById(req.params.id);

    res.status(200).send({ status: 200, msg: "ok", data: result });
  } catch (error) {
    if (isACustomError(error)) {
      if (error.error === "client") return res.status(404).send({ status: 404, msg: error.msg, details: error.details });
      return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
    }
    res.status(500).send({ status: 500, msg: error, details: { server: "Server error" } });
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
      if (isACustomError(error)) {
        if (error.error === "client") return res.status(404).send({ status: 404, msg: error.msg, details: error.details });
        return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
      }
      res.status(500).send({ status: 500, msg: error, details: "server error" });
    }
  }
);

//* Method Delete
pesanan.delete("/:id", async (req: Request, res: Response, Next: NextFunction) => {
  try {
    await deletePesananById(req.params.id);

    res.status(200).send({ status: 200, msg: "ok" });
  } catch (error) {
    if (isACustomError(error)) {
      if (error.error === "client") return res.status(404).send({ status: 404, msg: error.msg, details: error.details });
      return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
    }
    res.status(500).send({ status: 500, msg: error, details: { server: "server error" } });
  }
});

pesanan.put(
  "/",
  body("id").exists({ checkFalsy: true }),
  body("nama").exists({ checkFalsy: true }), //* Validasi apakah semuanya kosong
  body("jenisPesanan").exists({ checkFalsy: true }),
  body("jumlah").exists({ checkFalsy: true }),
  async (req: Request, res: Response, Next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send({ status: 404, msg: "some error has occured", errors: errors.array() }).status(404);
      }

      const { nama, jenisPesanan, jumlah, id } = req.body;
      const daftarMakanan = await getDaftarMakanan();

      //* Cek apakah jenis pesanana ada di dalam daftar makanan
      if (!daftarMakanan.find((obj) => obj.nama === jenisPesanan)) {
        return res.send({ status: 404, msg: `${jenisPesanan} Tidak Ada di dalam menu`, errors: [{ field: "jenisPesanan", msg: "Tidak ada dalam menu" }] });
      }

      const result = await updatePesanan(nama, jenisPesanan, jumlah, id);

      return res.status(200).send({ status: 200, msg: result });
    } catch (error) {
      if (isACustomError(error)) {
        if (error.error === "client") return res.status(404).send({ status: 404, msg: error.msg, details: error.details });
        return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
      } else {
        return res.status(500).send({ status: 500, msg: "Server Error", details: { server: "Server Error" } });
      }
    }
  }
);
