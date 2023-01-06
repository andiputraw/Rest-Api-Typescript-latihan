import { Request, Response, NextFunction } from "express";
import { authSchema, updateTokenSchema } from "../validation/auth.validation";
import { createLogInfo, newInfoLog, createLog } from "../utils/logger";
import { hashPassword } from "../utils/hashing";
import { createUser } from "../services/auth.services";
import { v4 } from "uuid";
import { createToken, addCounter } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  const { error, value } = authSchema.validate(req.body);

  if (error) {
    createLog("warn", "Error register" + error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, token: null });
  }

  try {
    value.password = await hashPassword(value.password);
    const result = await createUser(value.email, value.password);
    const jwt = await createToken(result[0]._id, result[0].token.id);
    createLogInfo("info", "Success register user", newInfoLog(req));
    return res.status(201).send({ status: true, statusCode: 201, message: "Success register user", token: jwt });
  } catch (error) {
    createLogInfo("warn", "Err Create user", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed create user", token: null });
  }
};

export const updateToken = async (req: Request, res: Response) => {
  const { error, value } = updateTokenSchema.validate(req.body);
  if (error) {
    createLog("warn", "Error register" + error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }
  try {
    await addCounter(value.token, value.amount);
    createLogInfo("info", `Success added ${value.amount} quota`, newInfoLog(req));
    return res.status(201).send({ status: true, statusCode: 201, message: `Success added ${value.amount} quota` });
  } catch (error) {
    createLogInfo("warn", "Err Create user", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed create user" });
  }
};
