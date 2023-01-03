import mongoose, { Schema } from "mongoose";

export interface IDaftarMakanan {
  nama: string;
  harga: Number;
}

//* Buat Schema daftar Makanan
const DaftarMakanan = mongoose.model(
  "DaftarMakanan",
  new Schema<IDaftarMakanan>({
    nama: { type: String, required: true },
    harga: { type: Number, required: true },
  })
);

export async function getDaftarMakanan(): Promise<IDaftarMakanan[]> {
  try {
    //* Ambil Daftar Makanan Lalu kembalikan dalam bentuk array of object
    const result = await DaftarMakanan.find();
    return result;
  } catch (error) {
    //* Jika error, ada masalah di server
    throw "Internal Error";
  }
}

export async function getHarga(jenisPesanan: string): Promise<number> {
  try {
    //* Ambil daftar makanan berdasarkan jenis pesanan. lalu ambil harganya
    const result = (await DaftarMakanan.findOne({ nama: jenisPesanan }))?.harga;
    //* Kembalikan hasil lalu paksa dia menjadi type number, karena kita sudah memvalidasi di bagian depan
    return result as number;
  } catch (error) {
    //* Jika error, berarti ada masalah di server
    throw error;
  }
}
