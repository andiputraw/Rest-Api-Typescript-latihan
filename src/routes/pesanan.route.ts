import { Router } from "express";

import { addPesanan, getPesanan, updatePesanan, deletePesanan } from "../controllers/pesanan.controller";

import { tokenChecker } from "../middleware/token.middleware";

export const pesanan: Router = Router();

pesanan.use(tokenChecker);
//* Method Get
pesanan.get("/", getPesanan);

pesanan.get("/:id", getPesanan);

//* Method POST
pesanan.post("/", addPesanan);

//* Method Delete
pesanan.delete("/:id", deletePesanan);

pesanan.put("/:id", updatePesanan);
