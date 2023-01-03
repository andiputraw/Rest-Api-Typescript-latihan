import mongoose, { Schema } from "mongoose";
import Ipesanan from "../types/pesanan.type";

export type Status = string | unknown;

//* Buat Schema pesanan.
export const pesanan = mongoose.model(
  "pesanan",
  new Schema<Ipesanan>({
    nama: { type: String, required: true },
    jenisPesanan: { type: String, required: true },
    jumlah: { type: Number, required: true },
    totalHarga: { type: Number, required: true },
  })
);
