import { Application, Router } from "express";
import { pesanan } from "./services/pesanan";
import { omset } from "./services/omset";

const routes: Array<[string, Router]> = [
  ["/pesanan", pesanan],
  ["/omset", omset],
];

export const init = (app: Application) => {
  routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
