import type { IInput } from "../../InputPlugin";
import type { TAnswer } from "../../types/answer";

export interface InputWithAnswers extends IInput<string> {
  answers: TAnswer[];
}
