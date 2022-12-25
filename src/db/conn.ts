import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/Restoran").then((v) => console.log("Koneksi Berhasil"));
