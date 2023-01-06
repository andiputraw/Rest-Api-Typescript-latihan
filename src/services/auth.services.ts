import mongoose, { MongooseError } from "mongoose";
import auth from "../models/auth.model";
import { v4 } from "uuid";

export async function createUser(email: string, password: string) {
  try {
    const token = v4();

    return await auth.create([{ email: email, password: password, token: { id: token } }]);
  } catch (error) {
    const convertedError: any = error;
    if (convertedError.code === 11000) {
      throw "email sudah ada";
    } else {
      throw "Something wrong happened";
    }
  }
}

export async function checkTokenInDB(id: string, token: string) {
  const result = await auth.findOne({ _id: id });
  if (result && result.token.counter <= 0) {
    return false;
  }

  return await auth.findOneAndUpdate({ _id: id, "token.id": token }, { $inc: { "token.counter": -1 } });
}

export async function updateToken(id: string, amount: number) {
  return await auth.updateOne({ _id: id }, { $inc: { "token.counter": amount } });
}
