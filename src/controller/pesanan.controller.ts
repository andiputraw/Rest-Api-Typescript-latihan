import { Request, Response } from "express";
import { insertPesanan, getPesananFromDB, getPesananById, deletePesananById, updatePesananById } from "../services/pesanan.services";
import { createLog, createLogInfo, newInfoLog } from "../utils/logger";
import { pesananSchema, cekPesanan } from "../validation/pesanan.validation";

export const addPesanan = async (req: Request, res: Response) => {
  const { error, value } = pesananSchema.validate(req.body);

  if (error) {
    createLog("error", "Error create pesanan : " + error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    await cekPesanan(value.jenisPesanan);
    await insertPesanan(value.pemesan, value.jenisPesanan, value.jumlah);
    createLog("info", "Success add product");
    return res.status(201).send({ status: true, statusCode: 200, message: "success add product" });
  } catch (error) {
    createLog("error", "Error create pesanan : " + error);
    return res.status(422).send({ status: false, statusCode: 422, message: error });
  }
};

export const getPesanan = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (id) {
    try {
      const result = await getPesananById(id);
      createLogInfo("info", "sucess get product by id", newInfoLog(req));
      return res.status(200).send({ status: true, statusCode: 200, data: result });
    } catch (error) {
      createLogInfo("warn", "failed get product by id", newInfoLog(req));
      return res.status(422).send({ status: false, statusCode: 422, message: error, data: {} });
    }
  } else {
    try {
      const result = await getPesananFromDB();
      createLogInfo("info", "succes get product", newInfoLog(req));
      return res.status(200).send({ status: true, statusCode: 200, data: result });
    } catch (error) {
      createLogInfo("warn", "failed get product", newInfoLog(req));
      return res.status(422).send({ status: false, statusCode: 422, message: error, data: {} });
    }
  }
};

export const updatePesanan = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { error, value } = pesananSchema.validate(req.body);

  if (error) {
    createLogInfo("warn", "Error create pesanan" + error.details[0].message, newInfoLog(req, error.details[0].message));
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    await cekPesanan(value.jenisPesanan);
    await updatePesananById(value.pemesan, value.jenisPesanan, value.jumlah, id);
    createLogInfo("info", "success update pesanan", newInfoLog(req));
    return res.status(200).send({ status: true, statusCode: 200, message: "Success update pesanan" });
  } catch (error) {
    createLogInfo("error", "failed update pesanan", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: error });
  }
};

export const deletePesanan = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await deletePesananById(id);
    createLogInfo("info", "success delete pesanan", newInfoLog(req));
    return res.status(200).send({ status: true, statusCode: 200, message: "success delete pesanan" });
  } catch (error) {
    createLogInfo("warn", "failed delete pesanan", newInfoLog(req, error));
    return res.status(422).send({ status: false, statusCode: 422, message: error });
  }
};
