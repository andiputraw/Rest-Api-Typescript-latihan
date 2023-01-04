import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authSchema } from "../validation/auth.validation";
import { createLogInfo, newInfoLog, createLog } from "../utils/logger";
import { hashPassword } from "../utils/hashing";
import { createUser } from "../services/auth.services";

export const registerUser = async (req: Request, res: Response) => {
  const { error, value } = authSchema.validate(req.body);

  if (error) {
    createLog("warn", "Error register" + error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    value.password = await hashPassword(value.password);
    await createUser(value.email, value.password);
    createLogInfo("info", "Success register user", newInfoLog(req));
    return res.status(201).send({ status: true, statusCode: 201, message: "Success register user" });
  } catch (error) {
    createLogInfo("warn", "Err Create user", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed create user" });
  }
};
