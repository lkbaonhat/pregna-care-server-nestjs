import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPasswordHelper = (plainPassword: string) => {
  return bcrypt.hash(plainPassword, saltRounds);
};

export const comparePasswordHelper = (
  plainPassword: string,
  hashPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashPassword);
};
