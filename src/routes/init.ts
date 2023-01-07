import { Application, Router } from "express";
import { pesanan } from "./pesanan.route";
import { omset } from "./omset";
import { auth } from "./auth.route";

//* Bungkus semua route ke array

const routes: Array<[string, Router]> = [
  ["/pesanan", pesanan],
  ["/omset", omset],
  ["/auth", auth],
];

//* Loop semua, lalu jalankan semua route nya
export const init = (app: Application) => {
  routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
