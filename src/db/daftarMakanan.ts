import mongoose, { Schema } from "mongoose";
getData();

export interface IDaftarMakanan {
  nama: string;
  harga: Number;
}

interface Result {
  status: number;
  data: IDaftarMakanan[] | [];
  msg: string;
}

const DaftarMakanan = mongoose.model(
  "DaftarMakanan",
  new Schema<IDaftarMakanan>({
    nama: { type: String, required: true },
    harga: { type: Number, required: true },
  })
);

export let globalData: IDaftarMakanan[] = [{ nama: "", harga: 0 }];
export let globalDaftarMakanan: string[] = [];

export async function getDaftarMakanan(): Promise<Result> {
  try {
    const result = await DaftarMakanan.find();
    return { status: 200, data: result, msg: "Data berhasil di ambil" };
  } catch (error) {
    return { status: 500, data: [], msg: "An error has occured" };
  }
}

setInterval(getData, 60000);

async function getData() {
  const tmp = (await getDaftarMakanan()).data;

  if (tmp.length > 0) {
    globalData = tmp;
    globalData.forEach((val) => globalDaftarMakanan.push(val.nama));
  }
}

getData();
