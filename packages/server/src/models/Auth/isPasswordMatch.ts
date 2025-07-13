import * as argon2 from "argon2";

export const isPasswordMatch = async (
  password: string,
  accountPassword: string,
) => {
  return argon2.verify(accountPassword, password);
};
