export class Conveyor<T> {
  private arr: T[];
  private length: number;
  private index: number;
  private done: boolean;
  

  constructor() {
    this.arr = [];
    this.length = this.arr.length;
    this.index = 0;
    this.done = this.length <= 0;
  }

  get position() {
    return this.index;
  }

  public add(arr: T[]): void {
    this.arr = this.arr.concat(arr);
    this.length += arr.length;
    this.done = this.index >= this.length;
  }

  public peek(): { value: T, done: boolean } {
    return { value: this.arr[this.index], done: this.done };
  }

  public next(length = 0): { value: T, done: boolean } {
    this.index += length;
    const next = this.peek().value;
    this.index += 1;
    this.done = this.index >= this.length;
    return { value: next, done: this.done };
  }
}