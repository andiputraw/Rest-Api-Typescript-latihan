import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

export const auth: Router = Router();

auth.post("/register", registerUser);
