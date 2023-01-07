import jwt from "jsonwebtoken";
import CONFIG from "../config/environtment";

/**
 * create a jwt asyncronously
 * @param payload object or string to be inserted
 * @returns json web token
 *
 */
export async function createJWT(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, `${CONFIG.secret_key}`, { algorithm: "HS256" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        if (typeof token !== "undefined") {
          resolve(token);
        } else {
          reject("error has occured");
        }
      }
    });
  });
}
/**
 * decode a jwt asyncrounsly
 * @param token encrypted token
 * @returns decoded token
 */
export async function decodeJWT(token: string): Promise<string | object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${CONFIG.secret_key}`, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        if (typeof decoded !== "undefined") {
          resolve(decoded);
        } else {
          reject("error has occured");
        }
      }
    });
  });
}
