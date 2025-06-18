for (var i = 0; i < 10; ++i) {
  console.log(i); // 0 .. 10

  setTimeout(() => {
    console.log(i); // 12 x 10
  }, 0);
}

++i; // no changes
i++;

console.log(i); // 12

////////////////////////

let loading = true;

setTimeout(() => {
  loading = false;
  console.log("1", loading);
}, 0);

Promise.resolve(() => {
  setTimeout(() => {
    loading = false;
    console.log("2", loading);
  }, 0);
});

Promise.resolve((loading = false));

while (loading) {
  console.log("loading ...");
}

setTimeout(() => {
  loading = false;
  console.log("3", loading);
}, 0);

// 1 false
// 3 false

///////////////////////////////////////

function counter() {
  let total = 0;

  const inc = () => {
    return ++total;
  };

  inc.reset = () => {
    total = 0;
  };

  return inc;
}

const myCounter = counter();

console.log(myCounter()); // 1
console.log(myCounter()); // 2
console.log(myCounter()); // 3 и тд

myCounter.reset();
console.log(myCounter()); // 1
console.log(myCounter()); // 2 и тд

///////////

const obj = {
  name: "Ozon",
  getName(a) {
    console.log(a);
    console.log(this.name);
  },
  getNameArrow: () => {
    return this.name;
  },
};

const fn = obj.getName;
// const fn2 = fn.bind(obj, "222");
// fn2();

function myBind(ctx, ...args) {
  const origFn = this;

  // имя временного свойства
  const tempKey = "__temp_fn__";

  return function (...innerArgs) {
    // делаем объект из примитива
    const context =
      ctx !== null && ctx !== undefined ? Object(ctx) : globalThis;

    context[tempKey] = origFn;

    const result = context[tempKey](...args, ...innerArgs);

    delete context[tempKey];
    return result;
  };
}

fn.bind = myBind;
const fn3 = fn.bind(obj, "333");
fn3();

/////////////////////

const retryFetch = (url, { retries = 3, delay = 3000 } = {}) => {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const controller = new AbortController();
      const signal = controller.signal;

      // Таймаут на отмену запроса
      const timeoutId = setTimeout(() => {
        controller.abort(); // отменяет fetch
      }, delay);

      fetch(url, { signal })
        .then((res) => {
          clearTimeout(timeoutId); // отмена таймера, если успели
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timeoutId);

          if (err.name === "AbortError") {
            console.warn(`⏱ Timeout after ${delay}ms`);
          }

          if (n > 0) {
            console.warn(`🔁 Retrying... (${retries - n + 1})`);
            attempt(n - 1);
          } else {
            reject(err);
          }
        });
    };

    attempt(retries);
  });
};

retryFetch("https://jsonplaceholder.typicode.com/posts/sssss", {
  retries: 3,
  delay: 1000,
});

/////////////////////////////

const limits = {
  5000: 5,
  1000: 5,
  500: 5,
  100: 5,
  10: 4,
};

const atm = (summ, limit) => {
  const tempLimits = { ...limit };
  const result = {};
  const limitsKeys = Object.keys(limit)
    .map(Number)
    .sort((a, b) => b - a);
  let targetSumm = summ;

  for (let i = 0; i < limitsKeys.length; i++) {
    const key = limitsKeys[i];
    let keyCount = Math.floor(targetSumm / key);
    if (keyCount > limit[key]) {
      keyCount = limit[key];
    }
    limit[key] = limit[key] - keyCount;
    targetSumm = targetSumm - keyCount * key;

    result[key] = keyCount;

    if (targetSumm === 0) {
      break;
    }
  }

  if (targetSumm !== 0) {
    limit = { ...tempLimits };
    console.log(limit);
    throw Error("unposible");
  } else {
    console.log(limit);
    return result;
  }
};

console.log(atm(15600, limits));
console.log(atm(15600, limits));
console.log(atm(15600, limits));

///////////////////////

const tickets = [
  { from: "Калининград", to: "Челябинск" },
  { from: "Москва", to: "Калининград" },
  { from: "Пятигорск", to: "Краснодар" },
  { from: "Челябинск", to: "Астана" },
  { from: "Краснодар", to: "Москва" },
];

const sort = (t) => {
  const dict = t.reduce((acc, val) => ({ ...acc, [val.from]: val.to }), {});
  const setFrom = new Set();
  const setTo = new Set();

  t.forEach((v) => {
    setFrom.add(v.from);
    setTo.add(v.to);
  });

  let fromPoint = setFrom.difference(setTo).keys().next().value;

  const result = [];

  while (fromPoint !== undefined) {
    if (dict[fromPoint]) {
      result.push({ form: fromPoint, to: dict[fromPoint] });
    }
    fromPoint = dict[fromPoint];
  }

  return result;
};

console.log(sort(tickets));

////////

console.log("A");

requestAnimationFrame(() => {
  console.log("B");
  requestAnimationFrame(() => console.log("C"));
});

Promise.resolve().then(() => console.log("D"));

setTimeout(() => console.log("E"), 0);
setTimeout(() => console.log("E1"), 0);
setTimeout(() => console.log("E2"), 0);

console.log("F");

////  a, f, d, e, e1, e2, b, c

const delay = (ms, result) => () =>
  new Promise((res) => setTimeout(() => res(result), ms));

const tasks = [
  delay(300, "A"),
  delay(200, "B"),
  delay(100, "C"),
  delay(400, "D"),
];

const runTasksWithLimit = async (tasks, limit) => {
  return new Promise((resolve, reject) => {
    const result = new Array(tasks.length);
    let tasksInProgress = 0;
    let lastTakenTaskIndex = 0;
    let completedCount = 0;

    const startNewTasks = () => {
      while (tasksInProgress < limit && lastTakenTaskIndex < tasks.length) {
        const currentIndex = lastTakenTaskIndex++;
        tasksInProgress++;
        runTask(tasks[currentIndex], currentIndex);
      }
    };

    const runTask = async (task, i) => {
      try {
        const res = await task();
        result[i] = res;
      } catch (e) {
        reject(e);
        return;
      }

      tasksInProgress--;
      completedCount++; // ✅ задача завершена

      if (completedCount === tasks.length) {
        resolve(result); // ✅ только когда все завершены
      } else {
        startNewTasks(); // ✅ пробуем запустить ещё задачи
      }
    };

    if (tasks.length === 0) {
      resolve([]); // ✅ граничный случай
    } else {
      startNewTasks(); // стартуем начальные задачи
    }
  });
};

runTasksWithLimit(tasks, 2).then(console.log);

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== "object") return false;

  const propsA = Object.keys(a);
  const propsB = Object.keys(b);

  if (propsA.length !== propsB.length) return false;

  for (let key of propsA) {
    if (!propsB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

const a = { x: 1, y: 2 };
const b = { x: 1 };

console.log(deepEqual(1, 1)); // true
console.log(deepEqual([1, 2], [1, 2])); // true
console.log(deepEqual({ a: 1 }, { a: 1 })); // true
console.log(deepEqual({ a: 1 }, { a: 2 })); // false
console.log(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })); // true
console.log(deepEqual({ a: undefined }, {})); // false
console.log(deepEqual("foo", NaN));
console.log(deepEqual(a, b));

function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args); // для простоты, неэффективен для вложенных структур
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId = null;
  let lastArgs = null;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      lastArgs = args;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, lastArgs);
      }, delay - (now - lastCall));
    }
  };
}
