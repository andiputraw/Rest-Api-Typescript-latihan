import jwt from "jsonwebtoken";
import "../db/conn";
import { checkEmail, insertEmail } from "../db/token";
import * as dotenv from "dotenv";
dotenv.config();

export type IToken = {
  email: string;
};

export async function createToken(email: string) {
  try {
    if (!(await checkEmail)) {
      throw "Email already registered";
    }

    const key = process.env.SECRET_KEY;
    if (typeof key === "undefined") {
      throw "ENV variable tidak terload";
    }

    await insertEmail(email);

    const token = jwt.sign({ email: email }, key);

    return token;
  } catch (error) {
    console.log(error);
  }
}

export function checkToken(token: string) {
  try {
    const key = process.env.SECRET_KEY;
    if (typeof key === "undefined") {
      throw "ENV variable tidak terload";
    }
    const decodedToken = jwt.verify(token, key);
    return decodedToken;

    //{ email: 'andiputraw@gmail.com', iat: 1672713778 }
  } catch (error) {
    console.log(error);
  }
}
