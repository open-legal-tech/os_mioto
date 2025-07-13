import * as argon2 from "argon2";

export const hashPassword = async (plainPassword: string) => {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    timeCost: 2,
    memoryCost: 15360,
  });
};
