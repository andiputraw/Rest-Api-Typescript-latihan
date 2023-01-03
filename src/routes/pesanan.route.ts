import { Router } from "express";

import { addPesanan, getPesanan, updatePesanan, deletePesanan } from "../controller/pesanan.controller";

export const pesanan: Router = Router();

//* Method Get
pesanan.get("/", getPesanan);

pesanan.get("/:id", getPesanan);

//* Method POST
pesanan.post("/", addPesanan);

//* Method Delete
pesanan.delete("/:id", deletePesanan);

pesanan.put("/:id", updatePesanan);
