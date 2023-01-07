import bcrypt from "bcrypt";

const saltRounds = 10;
/**
 * encrypt a password asyncronously
 * @param password not encrypted password
 * @returns encrypted pass
 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, saltRounds);
}
/**
 * compare between given password and encrypted password asyncronously
 * @param userPassword given password
 * @param encrypted encrypted password
 * @returns boolean
 */
export async function comparePassword(userPassword: string, encrypted: string) {
  return await bcrypt.compare(userPassword, encrypted);
}
