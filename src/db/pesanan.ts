import mongoose, { Schema } from "mongoose";

export interface Ipesanan {
  nama: string;
  jenisPesanan: string;
  jumlah: number;
  totalHarga: number;
}

export interface Status {
  status: number;
  msg: string | unknown;
}

const pesanan = mongoose.model(
  "pesanan",
  new Schema<Ipesanan>({
    nama: { type: String, required: true },
    jenisPesanan: { type: String, required: true },
    jumlah: { type: Number, required: true },
    totalHarga: { type: Number, required: true },
  })
);

export async function insertPesanan(pemesan: string, jenisPesanan: string, jumlah: number, totalHarga: number): Promise<Status> {
  try {
    await pesanan.insertMany([{ nama: pemesan, jenisPesanan: jenisPesanan, jumlah: jumlah, totalHarga: totalHarga }]);
    return { status: 200, msg: "Success" };
  } catch (error) {
    return { status: 500, msg: error };
  }
}
