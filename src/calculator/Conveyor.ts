export class Conveyor<T> {
  private arr: T[];
  private length: number;
  private index: number;
  

  constructor() {
    this.arr = [];
    this.length = this.arr.length;
    this.index = 0;
  }

  get position() {
    return this.index;
  }

  public add(arr: T[]): void {
    this.arr = this.arr.concat(arr);
    this.length += arr.length;
  }

  public peek(): { value: T, done: false } | { value: undefined, done: true } {
    return this.arr[this.index] != null ? 
      { value: this.arr[this.index], done: false } :
      { value: undefined, done: true };
  }

  public next(length = 0): { value: T, done: false } | { value: undefined, done: true } {
    this.index += length;
    const next = this.peek().value;
    this.index += 1;
    return next != null ? 
      { value: next, done: false } :
      { value: undefined, done: true };
  }
}