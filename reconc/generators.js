const rangeExample = () => {
  function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i;
    }
  }

  console.log([...range(3, 9)]);
};

const evenNumber = () => {
  const even = function* (count) {
    for (let i = 0; i < count; i++) {
      yield i * 2;
    }
  };

  console.log([...even(4)]);
};

const generatorWithParam = () => {
  const sayHi = function* () {
    const name = yield "Hi";
    return yield `Hi ${name}`;
  };

  const gen = sayHi();
  console.log(gen.next()); // { value: 'Привет', done: false }
  console.log(gen.next("Катя")); // { value: 'Привет, Катя', done: true }
};

const powGenerator = () => {
  const pow = async function* () {
    const number = yield "Value";
    const n = yield "Pow";
    return Math.pow(number, n);
  };

  const g = pow();
  console.log(g.next()); // "Введите число"
  console.log(g.next(3)); // "Введите степень"
  console.log(g.next(4)); // 81
};

const generatorCycle = () => {
  const cycle = function* (values) {
    let i = 0;
    for (i; i < values.length; i++) {
      yield values[i];
      if (i === values.length - 1) {
        i = -1;
      }
    }
  };

  const g = cycle(["A", "B", "C"]);
  console.log(g.next().value); // A
  console.log(g.next().value); // B
  console.log(g.next().value); // C
  console.log(g.next().value); // A
};

const asyncRange = async () => {
  const asRange = async function* (from, to, ms) {
    for (let i = from; i <= to; i++) {
      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
      await p;
      yield i;
    }
  };

  for await (const val of asRange(3, 5, 1000)) {
    console.log(val);
  }
};

const mergeStreams = async () => {
  const asRange = async function* (from, to, ms) {
    for (let i = from; i <= to; i++) {
      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
      await p;
      yield i;
    }
    return;
  };

  const p1 = asRange(1, 2, 1200);
  const p2 = asRange(2, 3, 500);

  async function* mergeStream(gen1, gen2) {
    // Создаём промисы для следующего значения из каждого генератора
    let nextGen1 = gen1.next();
    let nextGen2 = gen2.next();

    // Зацикливаем на ожидании данных
    while (true) {
      const promises = [];

      if (nextGen1.done !== true) {
        promises.push(
          nextGen1.then((res) => ({
            value: res.value,
            done: res.done,
            source: "gen1",
          }))
        );
      }
      if (nextGen2.done !== true) {
        promises.push(
          nextGen2.then((res) => ({
            value: res.value,
            done: res.done,
            source: "gen2",
          }))
        );
      }
      if (promises.length === 0) {
        break;
      }
      // Делаем race между промисами
      const { value, done, source } = await Promise.race(promises);

      if (done) {
        // Завершаем работу с тем генератором, который завершился
        if (source === "gen1") {
          nextGen1 = { value: undefined, done: true }; // Больше не вызываем gen1
        } else {
          nextGen2 = { value: undefined, done: true }; // Больше не вызываем gen2
        }

        if (nextGen1.done && nextGen2.done) {
          break; // Завершаем работу, если оба генератора завершены
        }
      } else {
        // Обновляем промисы для следующего вызова .next
        if (source === "gen1") {
          nextGen1 = gen1.next();
        } else {
          nextGen2 = gen2.next();
        }
      }

      if (value) yield { value, source };
    }
  }

  for await (const item of mergeStream(p1, p2)) {
    console.log(item);
  }
};

const asyncFilter = async () => {
  const asRange = async function* (from, to, ms) {
    for (let i = from; i <= to; i++) {
      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
      await p;
      yield i;
    }
  };

  const filter = async function* (gen, filterFn) {
    let doneGen = false;

    while (!doneGen) {
      let { value, done } = await gen.next();
      if (await filterFn(value)) {
        yield value;
      }
      doneGen = done;
    }

    return;
  };

  for await (const item of filter(
    asRange(1, 10, 1000),
    async (x) => x % 2 === 0
  )) {
    console.log(item); // только чётные
  }
};

const generatorWithErrors = () => {
  const tolerantGenerator = function* () {
    try {
      yield 1;
    } catch (error) {
      try {
        yield 2;
      } catch (error) {
        return;
      }
    }
  };

  const g = tolerantGenerator();

  console.log(g.next()); // { value: 1 }
  console.log(g.throw("oops")); // { value: 2 }
  console.log(g.throw("fail")); // { done: true }
};

const generatorsCombination = () => {
  const inputCollector = function* () {
    console.log("ready");
    const values = [yield, yield, yield];

    return values;
  };

  const wrapper = function* () {
    const result = yield* inputCollector();
    return result;
  };

  const main = function* () {
    const result = yield* wrapper();

    yield;

    return result;
  };

  const m = main();

  m.next();

  console.log(m.next(1));
  console.log(m.next(2));
  console.log(m.next(3));
  console.log(m.next());
  console.log(m.next());
};
