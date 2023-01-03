import mongoose from "mongoose";
import { getHarga } from "./daftarMakanan";
import { customError, isACustomError, newCustomError } from "../types/error.type";
import { pesanan } from "../models/pesanan.model";
import Ipesanan from "../types/pesanan.type";

// TODO update error handling

export async function insertPesanan(pemesan: string, jenisPesanan: string, jumlah: number) {
  // TODO Ganti sistem total harga biar di urus sama database

  //* Ambil harga berdasarkan jenisPesanan, lalu kalikan dengan jumlah
  const harga = await getHarga(jenisPesanan).then((result) => result * jumlah);
  //* Masukan ke daftar makanan, kembalikan sukses
  return await pesanan.insertMany([{ nama: pemesan, jenisPesanan: jenisPesanan, jumlah: jumlah, totalHarga: harga }]);
}

export async function getPesananFromDB(): Promise<Ipesanan[]> {
  const result = await pesanan.find();

  return result;
}

export async function getPesananById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
  }

  const result = await pesanan.findById(id);

  if (result === null) {
    throw { error: "client", msg: "id tidak ditemukan", details: { field: "_id", error: "id not found" } };
  }

  return result;
}

export async function deletePesananById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
  }

  const result = await pesanan.deleteOne({ _id: id });

  if (result.deletedCount < 1) {
    throw { error: "client", msg: "id tidak ditemukan", details: { field: "_id", error: "id not found" } };
  }
}

export async function updatePesananById(pemesan: string, jenisPesanan: string, jumlah: number, id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw { error: "client", msg: "id tidak valid", details: { field: "_id", error: "invalid id" } };
  }
  const harga = await getHarga(jenisPesanan).then((harga) => harga * jumlah);

  const result = await pesanan.updateOne({ _id: id }, { nama: pemesan, jenisPesanan: jenisPesanan, jumlah: jumlah, totalHarga: harga });

  if (result.matchedCount === 0) {
    throw newCustomError("client", "id Tidak ditemukan", { field: "id", error: "unknown id" });
  }

  return result;
}
