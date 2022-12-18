import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { init } from "./init";

const app: Express = express();
const port: number = 5000;

app.use(bodyParser.urlencoded({ extended: false }));

init(app);

app.listen(port, () => console.log(`Listening into http://localhost:${port}`));
