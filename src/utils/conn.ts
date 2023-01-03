import mongoose from "mongoose";
import { createLog } from "./logger";

mongoose
  .connect("mongodb://127.0.0.1:27017/Restoran")
  .then((v) => {
    console.log("Koneksi Berhasil");
    createLog("info", "Koneksi Ke database");
  })
  .catch(() => {
    console.log("Koneksi Gagal");
    createLog("error", "Gagal Koneksi Ke database");
  });
