import type { FatalError } from "./FatalError";

export type FailureConstructorParams<
  TCode extends string = any,
  TAddionalData = never,
  TParentError = never,
> = {
  code: TCode;
  additionalData?: TAddionalData;
  debugMessage?: string;
  parentError?: TParentError;
};

export class Failure<
  TCode extends string = any,
  TAddionalData = never,
  TParentError = never,
> extends Error {
  public readonly code: TCode;
  public readonly additionalData?: TAddionalData;
  public readonly debugMessage?: string;
  public readonly parentError?: TParentError;
  public readonly type = "failure";

  constructor({
    code,
    additionalData,
    debugMessage,
    parentError,
  }: FailureConstructorParams<TCode, TAddionalData, TParentError>) {
    super(code);
    this.code = code;
    this.additionalData = additionalData;
    this.debugMessage = debugMessage;
    this.parentError = parentError;
  }
  body(): {
    readonly code: TCode;
    readonly debugMessage: string | undefined;
    readonly type: "failure";
    readonly additionalData: TAddionalData | undefined;
    readonly parentError: string;
  } {
    return {
      code: this.code,
      debugMessage: this.debugMessage,
      type: this.type,
      additionalData: this.additionalData,
      parentError: JSON.stringify(this.parentError),
    } as const;
  }
}

export type ExtractFailures<TFn extends (...args: any) => any> = Extract<
  Awaited<ReturnType<TFn>>,
  Failure | FatalError
>;

export type ExcludeFailures<TFn extends (...args: any) => any> = Exclude<
  Awaited<ReturnType<TFn>>,
  Failure | FatalError
>;

export type FailureBody<
  TCode extends string = any,
  TAddionalData = never,
  TParentError = never,
> = ReturnType<
  InstanceType<typeof Failure<TCode, TAddionalData, TParentError>>["body"]
>;
