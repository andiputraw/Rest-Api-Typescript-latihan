import { Request, Response, NextFunction } from "express";
import { authSchema, updateTokenSchema } from "../validation/auth.validation";
import { createLogInfo, newInfoLog, createLog } from "../utils/logger";
import { hashPassword } from "../utils/hashing";
import { createUser, refreshId } from "../services/auth.services";
import { createToken, addCounter } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const value = await authSchema.validateAsync(req.body);
    value.password = await hashPassword(value.password);
    const result = await createUser(value.email, value.password);
    const jwt = await createToken(result[0]._id, result[0].token.id);
    createLogInfo("info", "Success register user", newInfoLog(req));
    return res.status(201).send({ status: true, statusCode: 201, message: "Success register user", token: jwt });
  } catch (error) {
    console.log(error);

    createLogInfo("warn", "Err Create user", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed create user", details: error, token: null });
  }
};

export const updateToken = async (req: Request, res: Response) => {
  try {
    const value = await updateTokenSchema.validateAsync(req.body);
    await addCounter(value.token, value.amount);
    createLogInfo("info", `Success added ${value.amount} quota`, newInfoLog(req));
    return res.status(201).send({ status: true, statusCode: 201, message: `Success added ${value.amount} quota` });
  } catch (error) {
    createLogInfo("warn", "Err Create user", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed create user" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const value = await authSchema.validateAsync(req.body);
    const result = await refreshId(value.email, value.password);

    const jwt = await createToken(result.userId, result.tokenId);
    createLogInfo("info", "Success refresh token", newInfoLog(req, jwt));
    return res.status(201).send({ status: true, statusCode: 201, message: "Success refresh token", token: jwt });
  } catch (error) {
    console.log(error);

    createLogInfo("warn", "failed refresh token", newInfoLog(req));
    return res.status(422).send({ status: false, statusCode: 422, message: "Failed refresh token", token: null });
  }
};
