import mongoose, { MongooseError } from "mongoose";
import auth from "../models/auth.model";

export async function createUser(email: string, password: string) {
  try {
    return await auth.create([{ email: email, password: password }]);
  } catch (error) {
    const convertedError: any = error;
    if (convertedError.code === 11000) {
      throw "email sudah ada";
    }
  }
}
