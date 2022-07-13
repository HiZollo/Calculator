export class Stack<T> {
  public size: number;
  private array: T[];
  

  constructor() {
    this.array = [];
    this.size = 0;
  }

  

  push(ele: T): void {
    this.size++;
    this.array.push(ele);
  }

  pop(): T | undefined {
    if (this.size > 0) this.size--;
    return this.array.pop();
  }
  peek(): T | undefined {
    return this.size > 0 ? this.array[this.size - 1] : undefined;
  }
}