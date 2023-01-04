import mongoose from "mongoose";
import IAuth from "../types/auth.type";

const auth = mongoose.model(
  "user",
  new mongoose.Schema<IAuth>(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, required: true, default: "regular" },
    },
    {
      timestamps: true,
    }
  )
);

export default auth;
