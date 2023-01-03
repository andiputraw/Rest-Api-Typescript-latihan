import joi from "joi";
import { getDaftarMakanan } from "../services/daftarMakanan";

export const pesananSchema = joi.object({
  pemesan: joi.string().required(),
  jenisPesanan: joi.string().required(),
  jumlah: joi.number().required(),
});

export async function cekPesanan(jenisPesanan: string) {
  const daftarMakanan = await getDaftarMakanan();
  if (!daftarMakanan.find((obj) => obj.nama === jenisPesanan)) {
    throw { error: "client", msg: `${jenisPesanan} Tidak ada dalam menu`, details: [{ field: "Pesanan", detail: `${jenisPesanan} tidak ditemukan` }] };
  }
}
