import express, { Express } from "express";
import bodyParser from "body-parser";
import { init } from "./routes/init";
import "./utils/conn";

const app: Express = express();
const port: number = 5000;

//* Body Parser agar bisa terima request dari luar
app.use(bodyParser.urlencoded({ extended: false }));
//* Jalankan Semua middleware routing
init(app);
//* Jalakan server
app.listen(port, () => console.log(`Listening into http://localhost:${port}`));
