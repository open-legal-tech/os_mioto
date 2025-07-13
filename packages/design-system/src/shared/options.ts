export const isOption = (option: any): option is Option =>
  option.type === "option";

export const isSubOption = (option: any): option is SubOption =>
  option.type === "sub-option";

export const isGroupOption = (option: any): option is GroupOption =>
  option.type === "group-option";

export type Option<TData extends any | undefined = any | undefined> = {
  name: string;
  id: string;
  data: TData;
  type: "option";
};

export type Options<TData extends any | undefined = any | undefined> = (
  | Option<TData>
  | GroupOption<TData>
)[];

export type SubOption<TData extends any | undefined = any | undefined> = {
  name: string;
  id: string;
  groupId: string;
  groupName: string;
  data: TData;
  type: "sub-option";
};

export type GroupOption<TData extends any | undefined = any | undefined> = {
  name: string;
  id: string;
  data?: TData;
  type: "group-option";
  isSelectable: boolean;
  subOptions: SubOption[];
};
