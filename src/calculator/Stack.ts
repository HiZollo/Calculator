export class Stack<T> {
  public size: number;
  private array: T[];
  

  constructor() {
    this.array = [];
    this.size = 0;
  }

  public push(ele: T): void {
    this.size++;
    this.array.push(ele);
  }

  public pop(): T | undefined {
    if (this.size > 0) this.size--;
    return this.array.pop();
  }
  public peek(): T | undefined {
    return this.size > 0 ? this.array[this.size - 1] : undefined;
  }
}