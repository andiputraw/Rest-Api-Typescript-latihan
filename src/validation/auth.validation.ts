import joi from "joi";

export const authSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});

export const updateTokenSchema = joi.object({
  token: joi.string().required(),
  amount: joi.number().required(),
});
