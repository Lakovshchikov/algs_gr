// Стек на массиве
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop(); // remove last
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Очередь на массиве
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift(); // remove first
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Примеры использования
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 2

const queue = new Queue<string>();
queue.enqueue("a");
queue.enqueue("b");
console.log(queue.dequeue()); // 'a'
