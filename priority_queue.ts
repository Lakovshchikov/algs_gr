// MaxPQ - Очередь с приоритетами на основе пирамиды (максимум в корне)
class MaxPQ<Key> {
  private pq: (Key | null)[];
  private N: number = 0;

  constructor(maxN: number) {
    this.pq = new Array(maxN + 1).fill(null); // pq[0] не используется
  }

  isEmpty(): boolean {
    return this.N === 0;
  }

  size(): number {
    return this.N;
  }

  insert(v: Key): void {
    this.pq[++this.N] = v;
    this.swim(this.N);
  }

  delMax(): Key | null {
    const max = this.pq[1];
    this.exch(1, this.N--);
    this.pq[this.N + 1] = null;
    this.sink(1);
    return max;
  }

  private swim(k: number): void {
    // Поднимаем элемент вверх по пирамиде
    while (k > 1 && this.less(Math.floor(k / 2), k)) {
      this.exch(Math.floor(k / 2), k);
      k = Math.floor(k / 2);
    }
  }

  private sink(k: number): void {
    // Опускаем элемент вниз по пирамиде
    while (2 * k <= this.N) {
      let j = 2 * k;
      if (j < this.N && this.less(j, j + 1)) j++;
      if (!this.less(k, j)) break;
      this.exch(k, j);
      k = j;
    }
  }

  private less(i: number, j: number): boolean {
    if (this.pq[i] === null || this.pq[j] === null) {
      throw new Error("Cannot compare null elements");
    }
    return (this.pq[i] as any).compareTo(this.pq[j]) < 0;
  }

  private exch(i: number, j: number): void {
    const temp = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = temp;
  }
}
