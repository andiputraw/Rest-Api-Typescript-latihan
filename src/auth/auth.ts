// import { Router, Request, Response, NextFunction } from "express";
// import * as jwt from "./token";
// import { checkCounter } from "../services/token";

// const auth: Router = Router();

// //cek token
// auth.use("/", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined;
//     if (typeof token === "undefined") throw "Token was not provided";

//     let decoded = jwt.checkToken(token);
//     if (typeof decoded === "undefined") throw "Token was invalid";
//     decoded = decoded as jwt.IToken;
//     if (await !checkCounter(decoded.email)) {
//       throw "Quota habis";
//     }
//     next();
//   } catch (error) {
//     res.status(404).send({ status: 404, msg: error });
//   }
// });

// //buat token
// auth.post("/", (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const email = req.body.email;
//   } catch (error) {}
// });
