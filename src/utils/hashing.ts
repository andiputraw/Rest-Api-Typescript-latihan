import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(userPassword: string, password: string) {
  return await bcrypt.compare(userPassword, password);
}
