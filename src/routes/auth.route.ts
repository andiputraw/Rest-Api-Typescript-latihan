import { Router } from "express";
import { registerUser, updateToken, refreshToken } from "../controllers/auth.controller";

export const auth: Router = Router();

auth.post("/register", registerUser);
auth.post("/update", updateToken);
auth.post("/refresh", refreshToken);
