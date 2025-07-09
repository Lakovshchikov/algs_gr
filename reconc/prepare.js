const sum = (a) => {
  let res = a;

  const cb = (b) => {
    if (b === undefined) {
      return res;
    }

    res += b;

    return cb;
  };

  return cb;
};

// console.log(sum(1)(2)(3)());
// console.log(sum(5)(-2)(10)(3)());
const bindWithLog = (fn, ctx) => {
  return (...args) => {
    console.log(`Called with context: ${ctx}, args: ${args}`);
    return fn.call(ctx, ...args);
  };
};

function greet(greeting, name) {
  return `${greeting}, ${name}! My name is ${this.name}`;
}

const user = { name: "Alice" };

const bound = bindWithLog(greet, user);

// console.log(bound("Hello", "Bob"));

const promisePool = (tasks, limit) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    let result = [];
    let currentRun = 0;

    const handler = (index) => (res) => {
      currentRun--;
      result[index] = res;

      if (i === tasks.length - 1) {
        resolve(result);
      } else if (limit > currentRun) {
        i++;
        startTask();
      }
    };

    const startTask = () => {
      currentRun++;
      tasks[i]().then(handler(i)).catch(handler(i));
    };

    while (i < limit) {
      startTask();
      if (i + 1 < limit) {
        i++;
      } else {
        break;
      }
    }
  });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
wait(3000).then(() => console.log("Asdsdsdsd"));

const res = await promisePool(
  [
    () => wait(3000).then(() => console.log("A")),
    () => wait(100).then(() => console.log("B")),
    () => wait(200).then(() => console.log("C")),
  ],
  2
);

console.log(res);

const ARROWS = {
  LEFT: "37",
  UP: "ArrowUp",
  RIGHT: "39",
  DOWN: "ArrowDown",
};

const useActiveIndex = (elementsCount, startIndex) => {
  const [activeIndex, setActiveIndex] = useState(
    typeof startIndex === "number" ? startIndex : 0
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === ARROWS.UP) {
        setActiveIndex((i) => (i === 0 ? 0 : i - 1));
      } else if (e.key === ARROWS.DOWN) {
        setActiveIndex((i) => (i === elementsCount ? i : i + 1));
      }
    },
    [elementsCount]
  );

  return useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      handleKeyDown,
    }),
    [activeIndex, setActiveIndex, handleKeyDown]
  );
};
