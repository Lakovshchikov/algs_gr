// Простая хеш-таблица на TypeScript

class HashTable<K extends string, V> {
  private buckets: Array<[K, V]>[];
  private size: number;

  constructor(size = 16) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }

  // Простейшая хеш-функция для строк
  private hash(key: K): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      const [existingKey] = bucket[i];
      if (existingKey === key) {
        bucket[i][1] = value; // Обновляем значение
        return;
      }
    }

    bucket.push([key, value]); // Добавляем новую пару
  }

  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const [existingKey, value] of bucket) {
      if (existingKey === key) {
        return value;
      }
    }

    return undefined;
  }

  delete(key: K): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return;
      }
    }
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
}

// Пример использования
const table = new HashTable<string, number>();

table.set("apple", 5);
table.set("banana", 10);

console.log(table.get("apple")); // 5
console.log(table.has("banana")); // true

table.delete("apple");
console.log(table.get("apple")); // undefined
