export class FatalError<TCode extends string = any> extends Error {
  public readonly code: TCode;
  public readonly parentError?: unknown;
  public readonly additionalData?: unknown;
  public readonly type = "fatal-error";

  constructor({
    code,
    debugMessage,
    parentError,
    additionalData,
  }: {
    code: TCode;
    debugMessage?: string;
    parentError?: unknown;
    additionalData?: unknown;
  }) {
    super(debugMessage);

    this.name = code;
    this.parentError = parentError;
    this.additionalData = additionalData;
    this.code = code;
  }

  static stringify(failure: FatalError): string {
    return JSON.stringify(failure);
  }

  body(): {
    code: TCode;
    type: string;
    message: string;
    parentError: string;
    additionalData: unknown;
  } {
    return {
      code: this.code,
      type: this.type,
      message: this.message,
      parentError: JSON.stringify(this.parentError),
      additionalData: this.additionalData,
    };
  }
}

export type FatalErrorBody = ReturnType<
  InstanceType<typeof FatalError>["body"]
>;
