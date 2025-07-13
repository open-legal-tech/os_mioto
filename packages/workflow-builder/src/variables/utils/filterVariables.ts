import { mapValues, pickBy, pipe } from "remeda";
import type { TChildId, TMainChildId, TNodeId } from "../../tree/id";
import type {
  GroupVariable,
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../exports/types";

export type Filters<
  TPrimitives extends PrimitiveVariable | IFileVariable | IRichTextVariable,
> = {
  includeEmptyRecords?: boolean;
  filterPrimitives?: (
    variable: PrimitiveVariable | IFileVariable | IRichTextVariable,
  ) => variable is TPrimitives;
  filterRecords?: (variable: IRecordVariable) => boolean;
  excludeIds?: (TNodeId | undefined)[];
  includeIds?: (TNodeId | undefined)[];
  includeChildIds?: (TChildId | TMainChildId)[];
  excludeChildIds?: (TChildId | TMainChildId)[];
};

export const filterVariables =
  <TPrimitives extends PrimitiveVariable | IFileVariable | IRichTextVariable>(
    filters: Filters<TPrimitives> = {
      includeEmptyRecords: false,
    },
  ) =>
  (variables: Record<TNodeId, GroupVariable>) => {
    return pipe(
      variables,
      mapValues((variable) => {
        return {
          ...variable,
          value: pickBy(variable?.value, (variable) => {
            if (
              filters.includeChildIds &&
              !filters.includeChildIds.includes(variable.id)
            ) {
              return false;
            }
            if (filters.excludeIds?.includes(variable.id)) return false;

            return filters?.filterPrimitives
              ? filters.filterPrimitives(variable)
              : true;
          }),
        } as IRecordVariable<TPrimitives>;
      }),
      (variables) =>
        pickBy(variables, (variable) => {
          if (filters.includeIds && !filters.includeIds.includes(variable.id))
            return false;
          if (filters.excludeIds?.includes(variable.id)) return false;

          // Filter out empty records.
          if (
            !filters.includeEmptyRecords &&
            Object.values(variable.value ?? {}).length === 0
          )
            return false;

          return filters?.filterRecords
            ? filters.filterRecords(variable)
            : true;
        }) as Record<TNodeId, IRecordVariable<TPrimitives>>,
    );
  };
