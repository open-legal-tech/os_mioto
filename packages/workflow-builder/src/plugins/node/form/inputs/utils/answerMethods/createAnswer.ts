import type { TAnswer } from "../../types/answer";

export const createAnswer = (answer: Pick<TAnswer, "value">) => {
  return { id: crypto.randomUUID(), ...answer };
};
