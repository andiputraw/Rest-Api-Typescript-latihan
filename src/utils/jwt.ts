import jwt from "jsonwebtoken";
import CONFIG from "../config/environtment";

export async function createJWT(id: any, token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: id, token: token }, `${CONFIG.secret_key}`, { algorithm: "HS256" }, (err, token) => {
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
