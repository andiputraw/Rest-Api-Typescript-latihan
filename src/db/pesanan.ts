import mongoose, { Schema } from "mongoose";
import { getHarga } from "./daftarMakanan";

export interface Ipesanan {
  nama: string;
  jenisPesanan: string;
  jumlah: number;
  totalHarga: number;
}

export type Status = string | unknown;

//* Buat Schema pesanan.
const pesanan = mongoose.model(
  "pesanan",
  new Schema<Ipesanan>({
    nama: { type: String, required: true },
    jenisPesanan: { type: String, required: true },
    jumlah: { type: Number, required: true },
    totalHarga: { type: Number, required: true },
  })
);

export async function insertPesanan(pemesan: string, jenisPesanan: string, jumlah: number): Promise<Status> {
  try {
    // TODO Ganti sistem total harga biar di urus sama database

    //* Ambil harga berdasarkan jenisPesanan, lalu kalikan dengan jumlah
    const harga = await getHarga(jenisPesanan).then((result) => result * jumlah);
    //* Masukan ke daftar makanan, kembalikan sukses
    await pesanan.insertMany([{ nama: pemesan, jenisPesanan: jenisPesanan, jumlah: jumlah, totalHarga: harga }]);
    return "Success";
  } catch (error) {
    // TODO buat logging
    console.log(error);
    //* Jika gagal, artinya ada masalah di server
    throw "Internal Error";
  }
}
