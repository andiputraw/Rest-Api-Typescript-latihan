import auth from "../models/auth.model";
import { v4 } from "uuid";
import { comparePassword } from "../utils/hashing";

export async function createUser(email: string, password: string) {
  try {
    const token = v4();

    return await auth.create([{ email: email, password: password, token: { id: token } }]);
  } catch (error) {
    console.log(error);

    const convertedError: any = error;
    if (convertedError.code === 11000) {
      throw "email sudah ada";
    } else {
      throw "Something wrong happened";
    }
  }
}

export async function checkUser(email: string, password: string) {
  try {
    const user = await auth.findOne({ email: email });
    if (user === null) {
      throw "user not found";
    }

    return await comparePassword(password, user.password);
  } catch (error) {
    throw error;
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

export async function refreshId(email: string, password: string) {
  const user = await auth.findOne({ email: email });
  if (user === null) {
    throw "user not found";
  }

  if (!(await comparePassword(password, user.password))) {
    throw "password doesnt match";
  }

  const id = v4();
  await auth.updateOne({ _id: user.id }, { "token.id": id });
  return { userId: user.id, tokenId: id };
}
