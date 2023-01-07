import { Request, Response, NextFunction } from "express";
import { checkTokenInDB } from "../services/auth.services";
import IJWT from "../types/token.type";
import { decodeJWT } from "../utils/jwt";

export async function tokenChecker(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (typeof token === "undefined") {
    return res.status(401).send({ status: false, statusCode: 401, message: "Unauthorized" });
  }

  const decodedJWT = (await decodeJWT(token)) as IJWT;

  try {
    const result = await checkTokenInDB(decodedJWT.id, decodedJWT.token);

    if (result === null) {
      return res.status(500).send("something bad occured");
    }
    if (result === false) {
      return res.status(402).send({ status: false, statusCode: 401, message: "Number of used tokens is exhausted" });
    }
    next();
  } catch (error) {
    return res.status(500).send("something bad occured");
  }
}
