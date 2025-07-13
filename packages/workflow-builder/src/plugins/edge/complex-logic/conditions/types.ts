import { z } from "zod";
import { ZChildId, ZMainChildId, ZNodeId } from "../../../../tree/id";

export const ZCondition = <TType extends string>(type: TType) =>
  z.object({
    id: z.string(),
    type: z.literal(type),
    variablePath: z.union([ZNodeId, ZChildId, ZMainChildId]),
  });

export type Condition<TType extends string = string> = z.infer<
  ReturnType<typeof ZCondition<TType>>
>;
