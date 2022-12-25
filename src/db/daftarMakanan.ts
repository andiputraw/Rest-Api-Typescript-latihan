import mongoose, { Schema } from "mongoose";

export interface IDaftarMakanan {
  nama: String;
  harga: Number;
}

interface Result {
  status: number;
  data: IDaftarMakanan[] | null;
  msg: string;
}

const DaftarMakanan = mongoose.model(
  "DaftarMakanan",
  new Schema<IDaftarMakanan>({
    nama: { type: String, required: true },
    harga: { type: Number, required: true },
  })
);

export async function getDaftarMakanan(): Promise<Result> {
  try {
    const result = await DaftarMakanan.find();
    return { status: 200, data: result, msg: "Data berhasil di ambil" };
  } catch (error) {
    return { status: 500, data: null, msg: "An error has occured" };
  }
}
