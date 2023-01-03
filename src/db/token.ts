import mongoose, { Schema } from "mongoose";

const user = mongoose.model(
  "user",
  new Schema({
    email: { type: String, required: true },
    counter: { type: Number, required: true },
  })
);

export async function checkEmail(email: string): Promise<boolean> {
  const checkUser = await user.findOne({ email: email });
  if (checkUser === null) {
    return false;
  }
  return true;
}

export async function insertEmail(email: string) {
  await user.insertMany({ email: email, counter: 100 });
}

export async function reduceCounter(email: string) {
  await user.updateOne({ email: email }, { $inc: { counter: -1 } });
}
/** * @param {string} param1 - string
 *
 * return true jika counter lebih dari 1, 0 atau kurang mengembalikan false
 * */
export async function checkCounter(email: string): Promise<boolean> {
  const checkUser = await user.findOne({ email: email });
  if (checkUser === null) throw "email not found";

  if (checkUser.counter <= 0) return false;
  return true;
}
