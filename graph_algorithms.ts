// DepthFirstSearch - Поиск в глубину (DFS) для пометки достижимых вершин
class DepthFirstSearch {
  private marked: boolean[];
  private count: number = 0;

  constructor(G: Graph, s: number) {
    this.marked = new Array(G.V()).fill(false);
    this.dfs(G, s);
  }

  private dfs(G: Graph, v: number): void {
    this.marked[v] = true;
    this.count++;
    for (const w of G.adj(v)) {
      if (!this.marked[w]) this.dfs(G, w);
    }
  }

  markedVertex(w: number): boolean {
    return this.marked[w];
  }

  getCount(): number {
    return this.count;
  }
}

// BreadthFirstPaths - Поиск в ширину (BFS) для нахождения кратчайших путей в графе
class BreadthFirstPaths {
  private marked: boolean[];
  private edgeTo: number[];
  private s: number;

  constructor(G: Graph, s: number) {
    this.marked = new Array(G.V()).fill(false);
    this.edgeTo = new Array(G.V());
    this.s = s;
    this.bfs(G, s);
  }

  private bfs(G: Graph, s: number): void {
    const queue: number[] = [];
    this.marked[s] = true;
    queue.push(s);

    while (queue.length > 0) {
      const v = queue.shift()!;
      for (const w of G.adj(v)) {
        if (!this.marked[w]) {
          this.edgeTo[w] = v;
          this.marked[w] = true;
          queue.push(w);
        }
      }
    }
  }

  hasPathTo(v: number): boolean {
    return this.marked[v];
  }

  pathTo(v: number): number[] | null {
    if (!this.hasPathTo(v)) return null;
    const path: number[] = [];
    for (let x = v; x !== this.s; x = this.edgeTo[x]) {
      path.push(x);
    }
    path.push(this.s);
    return path.reverse();
  }
}

// Cycle - Проверка на наличие циклов в неориентированном графе
class Cycle {
  private marked: boolean[];
  private hasCycleFlag: boolean = false;

  constructor(G: Graph) {
    this.marked = new Array(G.V()).fill(false);
    for (let s = 0; s < G.V(); s++) {
      if (!this.marked[s]) {
        this.dfs(G, s, s);
      }
    }
  }

  private dfs(G: Graph, v: number, u: number): void {
    this.marked[v] = true;
    for (const w of G.adj(v)) {
      if (!this.marked[w]) {
        this.dfs(G, w, v);
      } else if (w !== u) {
        this.hasCycleFlag = true;
      }
    }
  }

  hasCycle(): boolean {
    return this.hasCycleFlag;
  }
}

// TwoColor - Проверка, можно ли раскрасить граф двумя цветами (двудольность графа)
class TwoColor {
  private marked: boolean[];
  private color: boolean[];
  private isTwoColorable: boolean = true;

  constructor(G: Graph) {
    this.marked = new Array(G.V()).fill(false);
    this.color = new Array(G.V());
    for (let s = 0; s < G.V(); s++) {
      if (!this.marked[s]) {
        this.dfs(G, s);
      }
    }
  }

  private dfs(G: Graph, v: number): void {
    this.marked[v] = true;
    for (const w of G.adj(v)) {
      if (!this.marked[w]) {
        this.color[w] = !this.color[v];
        this.dfs(G, w);
      } else if (this.color[w] === this.color[v]) {
        this.isTwoColorable = false;
      }
    }
  }

  isBipartite(): boolean {
    return this.isTwoColorable;
  }
}

// DirectedCycle - Поиск цикла в ориентированном графе
class DirectedCycle {
  private marked: boolean[];
  private onStack: boolean[];
  private edgeTo: number[];
  private cycle: number[] | null = null;

  constructor(G: Digraph) {
    this.marked = new Array(G.V()).fill(false);
    this.onStack = new Array(G.V()).fill(false);
    this.edgeTo = new Array(G.V());
    for (let v = 0; v < G.V(); v++) {
      if (!this.marked[v]) this.dfs(G, v);
    }
  }

  private dfs(G: Digraph, v: number): void {
    this.onStack[v] = true;
    this.marked[v] = true;
    for (const w of G.adj(v)) {
      if (this.hasCycle()) return;
      else if (!this.marked[w]) {
        this.edgeTo[w] = v;
        this.dfs(G, w);
      } else if (this.onStack[w]) {
        this.cycle = [];
        for (let x = v; x !== w; x = this.edgeTo[x]) {
          this.cycle.push(x);
        }
        this.cycle.push(w);
        this.cycle.push(v);
        this.cycle.reverse();
      }
    }
    this.onStack[v] = false;
  }

  hasCycle(): boolean {
    return this.cycle !== null;
  }

  getCycle(): number[] | null {
    return this.cycle;
  }
}

// DepthFirstOrder - Порядок обхода вершин ориентированного графа (прямой, обратный, постордер)
class DepthFirstOrder {
  private marked: boolean[];
  private pre: number[] = [];
  private post: number[] = [];
  private reversePost: number[] = [];

  constructor(G: Digraph) {
    this.marked = new Array(G.V()).fill(false);
    for (let v = 0; v < G.V(); v++) {
      if (!this.marked[v]) this.dfs(G, v);
    }
  }

  private dfs(G: Digraph, v: number): void {
    this.pre.push(v); // прямой порядок (до обхода потомков)
    this.marked[v] = true;
    for (const w of G.adj(v)) {
      if (!this.marked[w]) this.dfs(G, w);
    }
    this.post.push(v); // постордер (после обхода всех потомков)
    this.reversePost.push(v); // это топологический порядок
  }

  preOrder(): number[] {
    return this.pre;
  }

  postOrder(): number[] {
    return this.post;
  }

  reversePostOrder(): number[] {
    return this.reversePost.reverse();
  }
}

// LazyPrimMST - Нахождение минимального остовного дерева с помощью ленивого алгоритма Прима
class LazyPrimMST {
  private marked: boolean[];
  private mst: Edge[];
  private pq: MinPQ<Edge>;

  constructor(G: EdgeWeightedGraph) {
    this.pq = new MinPQ<Edge>();
    this.marked = new Array(G.V()).fill(false);
    this.mst = [];
    this.visit(G, 0);
    while (!this.pq.isEmpty()) {
      const e = this.pq.delMin();
      const v = e.either();
      const w = e.other(v);
      if (this.marked[v] && this.marked[w]) continue;
      this.mst.push(e);
      if (!this.marked[v]) this.visit(G, v);
      if (!this.marked[w]) this.visit(G, w);
    }
  }

  private visit(G: EdgeWeightedGraph, v: number): void {
    this.marked[v] = true;
    for (const e of G.adj(v)) {
      if (!this.marked[e.other(v)]) {
        this.pq.insert(e);
      }
    }
  }

  edges(): Edge[] {
    return this.mst;
  }
}

// BellmanFordSP - Алгоритм Беллмана-Форда для кратчайших путей в графе с возможными отрицательными рёбрами
class BellmanFordSP {
  private distTo: number[];
  private edgeTo: DirectedEdge[];
  private onQueue: boolean[];
  private queue: number[];
  private cost: number = 0;
  private cycle: DirectedEdge[] | null = null;

  constructor(G: EdgeWeightedDigraph, s: number) {
    this.distTo = new Array(G.V()).fill(Infinity);
    this.edgeTo = new Array(G.V());
    this.onQueue = new Array(G.V()).fill(false);
    this.queue = [];
    this.distTo[s] = 0.0;
    this.queue.push(s);
    this.onQueue[s] = true;

    while (this.queue.length > 0 && !this.hasNegativeCycle()) {
      const v = this.queue.shift()!;
      this.onQueue[v] = false;
      this.relax(G, v);
    }
  }

  private relax(G: EdgeWeightedDigraph, v: number): void {
    for (const e of G.adj(v)) {
      const w = e.to();
      if (this.distTo[w] > this.distTo[v] + e.weight()) {
        this.distTo[w] = this.distTo[v] + e.weight();
        this.edgeTo[w] = e;
        if (!this.onQueue[w]) {
          this.queue.push(w);
          this.onQueue[w] = true;
        }
      }
    }
  }

  hasNegativeCycle(): boolean {
    return this.cycle !== null;
  }
}
