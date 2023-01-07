import { checkTokenInDB, updateToken } from "../services/auth.services";
import { createJWT, decodeJWT } from "./jwt";
import IJWT from "../types/token.type";

/**
 * add a quota based on user id inside jwt
 * @param token jwt token
 * @param amount number
 * @returns object of updated user
 */
export async function addCounter(token: string, amount: number) {
  const decodedJWT = (await decodeJWT(token)) as IJWT;

  return await updateToken(decodedJWT.id, amount);
}
/**
 * return a jwt based on createJWT function
 *
 * @param id id
 * @param token token
 * @returns return a jwt
 */
export async function createToken(id: any, token: string) {
  return await createJWT({ id, token });
}
