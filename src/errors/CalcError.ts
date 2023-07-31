import { ErrorCodes } from "./ErrorCodes";
import { Messages, Types } from "./ErrorInfo";

export class CalcError<T extends ErrorCodes> extends Error {
  public position: number;
  public code: T;
  public args: Parameters<(typeof Messages)[T]>;
  public type: (typeof Types)[T];

  constructor(position: number, code: T, ...args: Parameters<(typeof Messages)[T]>) {
    // @ts-ignore
    super(Messages[code](...args));

    this.position = position;
    this.code = code;
    this.args = args;
    this.type = Types[code];
  }

  get name() {
    return `[${this.type}] ${this.code}`;
  }
}