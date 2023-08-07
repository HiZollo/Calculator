export class Conveyor<T> {
  private arr: T[];
  private index: number;
  

  constructor() {
    this.arr = [];
    this.index = 0;
  }

  get position() {
    return this.index;
  }

  public add(arr: T[]): void {
    this.arr = this.arr.concat(arr);
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

  public wayback(n: number) {
    this.index -= n;
  }
}