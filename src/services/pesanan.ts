import { Request, Response, NextFunction, Router } from "express";
import { insertPesanan, Ipesanan, Status, getPesanan, getPesananById, deletePesananById, updatePesanan } from "../db/pesanan";
import { body, validationResult, oneOf } from "express-validator";
import { getDaftarMakanan, IDaftarMakanan } from "../db/daftarMakanan";
import { customError, isACustomError } from "../Types";
import { createLogInfo } from "../log/logger";

export const pesanan: Router = Router();

function routeError(req: Request, res: Response, error: customError, method: string, url: string) {
  createLogInfo("info", "failed", { ip: req.ip, method: "POST", url: "/pesanan", failed: error.msg });
  if (error.error === "client") return res.status(404).send({ status: 404, msg: error.msg, details: error.details });
  return res.status(500).send({ status: 500, msg: error.msg, details: error.details });
}

function cekPesanan(daftarMakanan: IDaftarMakanan[], jenisPesanan: string) {
  if (!daftarMakanan.find((obj) => obj.nama === jenisPesanan)) {
    throw { error: "client", msg: `${jenisPesanan} Tidak ada dalam menu`, details: [{ field: "Pesanan", detail: `${jenisPesanan} tidak ditemukan` }] };
  }
}

//* Method Get
pesanan.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPesanan();
    createLogInfo("info", "success", { ip: req.ip, method: "GET", url: "/pesanan" });
    res.status(200).send({ status: 200, msg: "ok", data: result });
  } catch (error) {
    if (isACustomError(error)) {
      return routeError(req, res, error, "GET", "/pesanan");
    }
    return res.status(500).send({ status: 500, msg: error, details: { server: "server error" } });
  }
});

pesanan.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await getPesananById(req.params.id);
    createLogInfo("info", "success", { ip: req.ip, method: "GET", url: "/pesanan" });
    res.status(200).send({ status: 200, msg: "ok", data: result });
  } catch (error) {
    if (isACustomError(error)) {
      return routeError(req, res, error, "GET", "/pesanan/:id");
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
        createLogInfo("info", "failed", { ip: req.ip, method: "POST", url: "/pesanan", failed: "Beberapa inputan kosong" });
        return res.send({ status: 404, msg: "some error has occured", errors: errors.array() }).status(404);
      }

      const { nama, jenisPesanan, jumlah }: Ipesanan = req.body;
      const daftarMakanan = await getDaftarMakanan();

      //* Cek apakah jenis pesanana ada di dalam daftar makanan
      cekPesanan(daftarMakanan, jenisPesanan);

      //* Masukan pesanan ke dalam database, lalu kirim pesan sukses
      const result: Status = await insertPesanan(nama, jenisPesanan, jumlah);
      createLogInfo("info", "success", { ip: req.ip, method: "POST", url: "/pesanan" });
      res.status(200).send({ status: 200, msg: result });
    } catch (error) {
      //* Jika gagal, berarti error internal
      if (isACustomError(error)) {
        return routeError(req, res, error, "POST", "/pesanan");
      }
      res.status(500).send({ status: 500, msg: error, details: "server error" });
    }
  }
);

//* Method Delete
pesanan.delete("/:id", async (req: Request, res: Response, Next: NextFunction) => {
  try {
    await deletePesananById(req.params.id);
    createLogInfo("info", "success", { ip: req.ip, method: "DELETE", url: "/pesanan" });
    res.status(200).send({ status: 200, msg: "ok" });
  } catch (error) {
    if (isACustomError(error)) {
      return routeError(req, res, error, "DELETE", "/pesanan");
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
        createLogInfo("info", "failed", { ip: req.ip, method: "PUT", url: "/pesanan", failed: "Beberapa inputan Kosong" });
        return res.send({ status: 404, msg: "some error has occured", errors: errors.array() }).status(404);
      }

      const { nama, jenisPesanan, jumlah, id } = req.body;
      const daftarMakanan = await getDaftarMakanan();

      //* Cek apakah jenis pesanana ada di dalam daftar makanan
      cekPesanan(daftarMakanan, jenisPesanan);

      const result = await updatePesanan(nama, jenisPesanan, jumlah, id);
      createLogInfo("info", "success", { ip: req.ip, method: "PUT", url: "/pesanan" });
      return res.status(200).send({ status: 200, msg: result });
    } catch (error) {
      if (isACustomError(error)) {
        return routeError(req, res, error, "GET", "/pesanan/:id");
      } else {
        return res.status(500).send({ status: 500, msg: "Server Error", details: { server: "Server Error" } });
      }
    }
  }
);
