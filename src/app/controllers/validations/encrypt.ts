import * as bcrypt from "bcryptjs";


export function encriptPassword(password: string): string{
  return bcrypt.hashSync(password, 8);
}

export function checkPassword(password_hash: string, password: string){
  return bcrypt.compareSync(password_hash, password);
}