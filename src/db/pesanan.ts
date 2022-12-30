import mongoose, { mongo, ObjectId, Schema } from "mongoose";
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
    return "ok";
  } catch (error) {
    // TODO buat logging
    console.log(error);
    //* Jika gagal, artinya ada masalah di server
    throw "Internal Error";
  }
}

export async function getPesanan(): Promise<Ipesanan[]> {
  try {
    const result = await pesanan.find();

    return result;
  } catch (error) {
    throw "internal Error";
  }
}

export async function getPesananById(id: string): Promise<{ status: number; msg: string; data: Ipesanan | null }> {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { status: 0, msg: "Id Tidak Valid", data: null };
    }

    const result = await pesanan.findById(id);

    if (result === null) {
      return { status: 0, msg: "Id Tidak Ditemukan", data: null };
    }

    return { status: 1, msg: "ok", data: result };
  } catch (error) {
    throw "internal Error";
  }
}

export async function deletePesananById(id: string): Promise<{ status: number; msg: string }> {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { status: 0, msg: "Id Tidak Valid" };
    }

    const result = await pesanan.deleteOne({ _id: id });

    if (result.deletedCount < 1) {
      return { status: 0, msg: "Id Tidak Ditemukan" };
    }

    return { status: 1, msg: "ok" };
  } catch (error) {
    throw "Internal Error";
  }
}
