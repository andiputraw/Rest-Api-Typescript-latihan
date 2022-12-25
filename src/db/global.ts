import { getDaftarMakanan, IDaftarMakanan } from "./daftarMakanan";

let data: IDaftarMakanan[] | null;
let msg: String;

setInterval(async () => {
  const result = await getDaftarMakanan();
  data = result.data;
  if (data === null) {
    msg = result.msg;
  }
}, 60000);
