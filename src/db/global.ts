import { getDaftarMakanan, IDaftarMakanan } from "./daftarMakanan";

export let data: IDaftarMakanan[] | null;
export let msg: String;
export let daftarMakanan: string[] = [];

setInterval(isiData, 60000);

async function isiData() {
  const result = await getDaftarMakanan();
  data = result.data;

  data?.forEach((v) => daftarMakanan.push(v.nama));
  console.log(daftarMakanan);

  if (data === null) {
    msg = result.msg;
  }
}
isiData();
