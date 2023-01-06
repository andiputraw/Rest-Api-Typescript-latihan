import mongoose from "mongoose";

const auth = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, required: true, default: "regular" },
      token: {
        type: {
          id: { type: String, required: true },
          counter: { type: Number, default: 10 },
        },
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

export default auth;
