import { checkTokenInDB, updateToken } from "../services/auth.services";
import { createJWT, decodeJWT } from "./jwt";
import IJWT from "../types/token.type";

export async function addCounter(token: string, amount: number) {
  const decodedJWT = (await decodeJWT(token)) as IJWT;

  return await updateToken(decodedJWT.id, amount);
}

export async function createToken(id: any, token: string) {
  return await createJWT(id, token);
}
