const delayPromises = () => {
  const delay = (ms) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    });

  delay(1000).then((ms) => {
    console.log(`Resolved after ${ms} milliseconds`);
  });
};

window.delay = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });

const retryPromises = () => {
  const retry = (fn, attempts = 3) => {
    return fn()
      .then((res) => {
        if (res.status === 404) throw new Error("Resource not found");
        return res;
      })
      .catch((err) => {
        if (attempts > 1) {
          return retry(fn, attempts - 1);
        } else {
          throw err;
        }
      });
  };

  retry(() => fetch("https://jsonplaceholder.typicode.com/posts/sd"), 3)
    .then(console.log)
    .catch((err) => console.error("Failed after 3 retries:", err));
};

const allPromises = () => {
  const myAllPromises = (promises) => {
    return new Promise((resolve, reject) => {
      const resolvedPromises = [];

      promises.forEach((promise, index) => {
        promise
          .then((value) => {
            resolvedPromises[index] = value;

            if (resolvedPromises.length === promises.length) {
              resolve(resolvedPromises);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  };

  myAllPromises([
    new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    new Promise((resolve) => setTimeout(() => reject(3), 3000)),
  ])
    .then(console.log)
    .catch(console.error);
};

const orderedPromises = () => {
  const runInSequence = (tasks) => {
    return new Promise((resolve, reject) => {
      const results = [];
      let i = 0;

      const resolveCb = (data) => {
        results[i] = data;
        i++;
        if (i === tasks.length) {
          resolve(results);
        } else {
          tasks[i]().then(resolveCb);
        }
      };

      tasks[i]().then(resolveCb);
    });
  };

  const tasks = [
    () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
  ];

  runInSequence(tasks).then(console.log);
};

const wrongLoading = () => {
  async function load() {
    const a = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const b = await fetch("https://jsonplaceholder.typicode.com/posts/2");
    const dataA = await a.json();
    const dataB = await b.json();
    return [dataA, dataB];
  }

  load().then((data) => {
    console.log(data);
  });
};

const timeoutPromise = () => {
  const timeout = (promise, ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout"));
      }, ms);

      promise.then(resolve).catch(reject);
    });
  };

  timeout(fetch("https://jsonplaceholder.typicode.com/posts/1"), 500)
    .then(console.log)
    .catch(console.error); // "Timeout"
};

const parallelLimit = () => {
  const parallelLim = (tasks, limit) => {
    return new Promise((resolve) => {
      const result = [];
      let i = 0;

      const resolveCb = (data) => {
        result.push(data);
        if (result.length === tasks.length) {
          resolve(result);
        } else {
          if (i < tasks.length) {
            tasks[i]().then(resolveCb, rejectCb);
            i++;
          }
        }
      };

      const rejectCb = (err) => {
        results[i] = err;
        if (results.length === tasks.length) {
          resolve(results);
        } else {
          if (i < tasks.length) {
            tasks[i]().then(resolveCb, rejectCb);
            i++;
          }
        }
      };
      while (i < limit) {
        tasks[i]().then(resolveCb, rejectCb);
        i++;
      }
    });
  };

  const tasks = [
    () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
    () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
  ];

  parallelLim(tasks, 2);
};

const asyncAwaitOrder = async () => {
  const orderedPromises = async (tasks) => {
    const result = [];

    for (const task of tasks) {
      const res = await task();
      result.push(res);
    }

    return Promise.resolve(result);
  };

  const tasks = [
    () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
  ];

  await orderedPromises(tasks).then(console.log);
};

const errorWithoutCatch = () => {
  async function test() {
    throw new Error("fail");
  }

  test();

  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    console.log("Unhandled promise rejection:", event.reason);
  });
};

const taskQueue = () => {
  class TaskQueue {
    constructor(limit) {
      this.limit = limit;
      this.queue = [];
      this.activeCount = 0;
      this.map = new WeakMap();
    }

    add(task) {
      return this.runTask(task);
    }

    runTask(task, prData) {
      let result;

      if (prData) {
        const { promise, resolve } = prData;
        result = promise;
        this.activeCount++;
        task().then(resolve).finally(this.runNext);
      } else {
        result = new Promise((resolve) => {
          if (this.activeCount < this.limit) {
            this.activeCount++;
            task().then(resolve).finally(this.runNext);
          } else {
            this.queue.push(task);
            this.map.set(task, { promise: result, resolve });
          }
        });
      }

      return result;
    }

    runNext = () => {
      const task = this.queue.shift();

      if (task) {
        const prData = this.map.get(task);
        this.runTask(task, prData);
      } else {
        this.activeCount--;
      }
    };
  }

  const queue = new TaskQueue(2); // максимум 2 задачи одновременно

  queue.add(() => delay(1000).then(() => "A")).then(console.log);
  queue.add(() => delay(1000).then(() => "B")).then(console.log);
  queue.add(() => delay(500).then(() => "C")).then(console.log);
};

// console.log("A");

// Promise.resolve()
//   .then(() => {
//     console.log("B");

//     queueMicrotask(() => {
//       console.log("C");
//     });

//     return Promise.resolve().then(() => {
//       console.log("D");
//     });
//   })
//   .then(() => {
//     console.log("E");
//   });

// (async () => {
//   console.log("F");
//   await null;
//   console.log("G");
//   await Promise.resolve();
//   console.log("H");
// })();

// setTimeout(() => {
//   console.log("I");
// }, 0);

// console.log("J");

///////////////////////////////////////////////////////////////

// console.log("A");

// setTimeout(() => {
//   console.log("B");
// }, 0);

// Promise.resolve()
//   .then(() => {
//     console.log("C");
//     return Promise.resolve();
//   })
//   .then(() => {
//     console.log("D");
//   });

// (async () => {
//   console.log("E");
//   await null;
//   console.log("F");
//   await Promise.resolve();
//   console.log("G");
// })();

// console.log("H");

/////////////////////////////////////////////////////

// console.log("A");

// setTimeout(() => {
//   console.log("B");
// }, 0);

// queueMicrotask(() => {
//   console.log("C");
// });

// Promise.resolve()
//   .then(() => {
//     console.log("D");
//     queueMicrotask(() => {
//       console.log("E");
//     });
//     setTimeout(() => {
//       console.log("F");
//     }, 0);
//     return Promise.resolve();
//   })
//   .then(() => {
//     console.log("G");
//   });

// const channel = new MessageChannel();
// channel.port1.onmessage = () => {
//   console.log("H");
// };
// channel.port2.postMessage(null);

// (async () => {
//   console.log("I");
//   await null;
//   console.log("J");
//   await Promise.resolve();
//   console.log("K");
// })();

// console.log("L");

///AILCDJEKGBHF

// console.log("A");

// requestAnimationFrame(() => {
//   console.log("B");
//   requestAnimationFrame(() => console.log("C"));
// });

// Promise.resolve().then(() => console.log("D"));

// setTimeout(() => console.log("E"), 0);
// setTimeout(() => console.log("E1"), 0);
// setTimeout(() => console.log("E2"), 0);

// console.log("F");
