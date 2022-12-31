import mongoose, { mongo, ObjectId, Schema } from "mongoose";
import { getHarga } from "./daftarMakanan";
import { customError, isACustomError, newCustomError } from "../Types";

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
    const err: customError = { error: "server", msg: "server error", details: {} };

    throw err;
  }
}

export async function getPesanan(): Promise<Ipesanan[]> {
  try {
    const result = await pesanan.find();

    return result;
  } catch (error) {
    const err: customError = { error: "server", msg: "server error", details: {} };

    throw err;
  }
}

export async function getPesananById(id: string): Promise<{ msg: string; data: Ipesanan }> {
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
    }

    const result = await pesanan.findById(id);

    if (result === null) {
      throw { error: "client", msg: "id tidak ditemukan", details: { field: "_id", error: "id not found" } };
    }

    return { msg: "ok", data: result };
  } catch (error) {
    if (isACustomError(error)) {
      throw error;
    } else {
      throw { error: "server", msg: "Server Error", details: {} };
    }
  }
}

export async function deletePesananById(id: string): Promise<string> {
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
    }

    const result = await pesanan.deleteOne({ _id: id });

    if (result.deletedCount < 1) {
      throw { error: "client", msg: "id tidak ditemukan", details: { field: "_id", error: "id not found" } };
    }

    return "ok";
  } catch (error) {
    if (isACustomError(error)) {
      throw error;
    } else {
      throw { error: "server", msg: "server Error", details: {} };
    }
  }
}

export async function updatePesanan(pemesan: string, jenisPesanan: string, jumlah: number, id: string): Promise<Status> {
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
    }
    const harga = await getHarga(jenisPesanan).then((harga) => harga * jumlah);

    const result = await pesanan.updateOne({ _id: id }, { nama: pemesan, jenisPesanan: jenisPesanan, jumlah: jumlah, harga: harga });

    if (result.modifiedCount === 0) {
      throw newCustomError("client", "id Tidak ditemukan", { field: "id", error: "unknown id" });
    }

    return "ok";
  } catch (error) {
    if (isACustomError(error)) {
      throw error;
    } else {
      throw newCustomError("server", "server Error", {});
    }
  }
}
