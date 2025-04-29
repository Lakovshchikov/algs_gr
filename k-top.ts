function topKFrequent(nums: number[], k: number): number[] {
  const count: Map<number, number> = new Map();

  // 1. Посчитать частоты
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // 2. Массив списков: bucket[i] содержит все числа, встречающиеся i раз
  const bucket: number[][] = Array.from({ length: nums.length + 1 }, () => []);

  for (const [num, freq] of count.entries()) {
    bucket[freq].push(num);
  }

  // 3. Собирать ответ, начиная с максимальной частоты
  const result: number[] = [];
  for (let freq = bucket.length - 1; freq >= 0 && result.length < k; freq--) {
    for (const num of bucket[freq]) {
      result.push(num);
      if (result.length === k) {
        break;
      }
    }
  }

  return result;
}

function subarraySum(nums: number[], k: number): number {
  let sum = 0;
  let count = 0;
  const map = new Map<number, number>();
  map.set(0, 1);

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];

    if (map.has(sum - k)) {
      count += map.get(sum - k)!;
    }

    map.set(sum, (map.get(sum) ?? 0) + 1);
  }

  return count;
}

function threeSum(nums: number[]): number[][] {
  let result = [];
  nums.sort((a, b) => (a > b ? 1 : -1));
  let cache = new Set<string>();

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let right = nums.length - 1;
    let left = i + 1;

    while (left < right) {
      const summ = nums[i] + nums[left] + nums[right];

      if (summ === 0) {
        const v = [nums[i], nums[left], nums[right]];

        if (!cache.has(v.toString())) {
          result.push(v);
          cache.add(v.toString());
        }
        left++;
        right--;
      } else if (summ > 0) {
        right--;
      } else if (summ < 0) {
        left++;
      }
    }
  }

  return result;
}

function canPartition(nums: number[]): boolean {
  const summ = nums.reduce((acc, v) => {
    return acc + v;
  }, 0);

  if (summ % 2 !== 0) return false;

  const target = summ / 2;
  const dp = new Array(target + 1).fill(false);

  dp[0] = true;

  for (let num of nums) {
    for (let i = target; i >= num; i--) {
      dp[i] = dp[i] || dp[i - num];
    }
  }

  return dp[target];
}

function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

/// Longest Substring Without Repeating Characters

function lengthOfLongestSubstring(s: string): number {
  const store = new Set();
  let left = 0;
  let result = 0;
  let tempLength = 0;

  for (let right = 0; right < s.length; right++) {
    if (store.has(s[right])) {
      while (s[left] !== s[right]) {
        store.delete(s[left]);
        left++;
        tempLength--;
      }
      left++;
    } else {
      store.add(s[right]);
      tempLength++;
    }
    if (tempLength > result) {
      result = tempLength;
    }
  }

  return result;
}

/// Longest Palindromic Substring

function longestPalindrome(s: string): string {
  if (s.length === 1) {
    return s;
  }
  if (s.length === 2 && s[0] === s[1]) {
    return s;
  }
  let result = [0, 0];

  const getPalindrome = (left: number, right: number) => {
    let result = [0, 0];
    let l = left;
    let r = right;

    if (s[l - 1] === undefined) {
      return s[l] === s[r + 1] ? [l, r + 1] : result;
    }
    if (s[r + 1] === undefined) {
      return s[r] === s[l - 1] ? [l - 1, r] : result;
    }

    while (s[l] === s[r] && s[l] !== undefined && s[r] !== undefined) {
      result = [l, r];
      l--;
      r++;
    }

    return result;
  };

  for (let i = 0; i <= s.length - 1; i++) {
    const tempOdd = getPalindrome(i, i);
    const tempEven = getPalindrome(i, i + 1);

    const oddLength = tempOdd[1] - tempOdd[0];
    const evenLength = tempEven[1] - tempEven[0];

    const res = oddLength > evenLength ? tempOdd : tempEven;

    if (result[1] - result[0] < res[1] - res[0]) {
      result = res;
    }
  }

  return s.substring(result[0], result[1] + 1);
}

//// Network Delay Time

function networkDelayTime(times: number[][], n: number, k: number): number {
  const g = new Graph(times, n);
  const distTo: number[] = new Array(n + 1);
  const edgeTo: DirectedEdge[] = new Array(n + 1);
  const onQ: boolean[] = new Array(n + 1);
  const queue: number[] = [];

  distTo.fill(Infinity);
  distTo[k] = 0;
  distTo[0] = -Infinity;

  queue.push(k);
  onQ[k] = true;

  const relax = (v: number) => {
    for (let edge of g.getAdj(v)) {
      const w = edge.to;

      if (distTo[w] > distTo[v] + edge.weight) {
        distTo[w] = distTo[v] + edge.weight;
        edgeTo[w] = edge;

        if (!onQ[w]) {
          queue.unshift(w);
          onQ[w] = true;
        }
      }
    }
  };

  while (queue.length !== 0) {
    const v = queue.pop();
    if (v) {
      onQ[v] = false;
      relax(v);
    }
  }

  let isImp = false;
  for (let i = 1; i <= distTo.length; i++) {
    if (distTo[i] === Infinity) {
      isImp = true;
    }
  }

  return isImp ? -1 : Math.max(...distTo);
}

class Graph {
  E: number;
  V: number;
  adj: Array<Set<DirectedEdge>> = [];

  constructor(edges: number[][], n: number) {
    this.E = edges.length;
    this.V = n;

    for (let i = 1; i <= n; i++) {
      this.adj[i] = new Set();
    }

    edges.forEach((data) => {
      const de = new DirectedEdge(data);
      this.adj[de.from].add(de);
    });
  }

  getAdj(i: number) {
    return this.adj[i];
  }
}

class DirectedEdge {
  from: number;
  to: number;
  weight: number;

  constructor(data: number[]) {
    this.from = data[0];
    this.to = data[1];
    this.weight = data[2];
  }
}

///

function minCostConnectPoints(points: number[][]): number {
  const pq = new MinPQ();
  const marked: boolean[] = [];
  let summ = 0;

  const visit = (i: number) => {
    marked[i] = true;

    points.forEach((v, j) => {
      if (i !== j && !marked[j]) {
        pq.add(new Edge({ i, v: points[i] } as A, { i: j, v } as A));
      }
    });
  };

  visit(0);

  while (!pq.isEmpty()) {
    const edge = pq.getMin();

    const v = edge.getOther();
    const w = edge.getEnother(v.v);

    if (marked[v.i] && marked[w.i]) continue;

    summ += edge.weight;

    if (!marked[v.i]) visit(v.i);
    if (!marked[w.i]) visit(w.i);
  }

  return summ;
}
