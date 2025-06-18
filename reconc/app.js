const thisExample = () => {
  const obj = {
    getThisGetter() {
      const getter = () => this;
      return getter;
    },
    getArrowContext: () => this,
  };

  const fn = obj.getThisGetter();
  console.log(fn() === obj);
  console.log(obj.getArrowContext.call(obj) === obj);

  console.log(obj.getArrowContext());
};

const rangeIteratorExample = () => {
  const range = {
    from: 1,
    to: 5,
    [Symbol.iterator]() {
      let start = this.from;
      let end = this.to;

      return {
        next() {
          if (start <= end) {
            return { done: false, value: start++ };
          }
          return { done: true };
        },
      };
    },
    [Symbol.toPrimitive](hint) {
      if (hint === "string") {
        return `${this.from}..${this.to}`;
      }
      if (hint === "number") {
        return this.from + this.to;
      }
      return this;
    },
  };

  for (let v of range) {
    console.log(v);
  }
  console.log(+range);
  console.log(`${range}`);
};

const createEnumExample = () => {
  const createEnum = (values) => {
    let result = {};

    values.forEach((element) => {
      result[element] = Symbol(element);
    });

    return Object.freeze(result);
  };

  const Colors = createEnum(["RED", "GREEN", "BLUE"]);

  console.log(Colors.RED); // Symbol(RED)
  console.log(Colors.GREEN.toString()); // "Symbol(GREEN)"
  console.log(Object.keys(Colors)); // ["RED", "GREEN", "BLUE"]

  // Цвета уникальны
  console.log(Colors.RED === Colors.GREEN); // false

  // Попробовать переопределить
  Colors.RED = "LOL"; // не работает
  console.log(Colors.RED); // всё ещё Symbol(RED)
};

const createClassSymbolExample = () => {
  const pass = Symbol("pass");

  class User {
    constructor(name) {
      this.name = name;
    }

    [pass] = "1234";

    checkPassword(password) {
      return this[pass] === password;
    }
  }

  const user = new User("John");
  console.log(user.checkPassword("1234")); // true
  console.log(user.checkPassword("12345")); // false
  console.log(user.pass); // undefined
  console.log(JSON.stringify(user)); // {"name":"John"}
};

const carryingExample = () => {
  const carry = (fn) => {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn(...args);
      } else {
        return function (...argsNext) {
          return curried.apply(this, [...args, ...argsNext]);
        };
      }
    };
  };

  const summ3 = (a, b, c) => a + b + c;
  const curriedSumm3 = carry(summ3);
  console.log(curriedSumm3(1)(2)(3)); // 6
  console.log(curriedSumm3(1, 2)(3)); // 6
  console.log(curriedSumm3(1, 2, 3)); // 6
};

const protoExample = () => {
  function Animal() {}

  const animal1 = new Animal();
  const animal2 = Object.create(Animal.prototype);

  console.log(animal1.__proto__ === Animal.prototype); // true
  console.log(animal2.__proto__ === Animal.prototype); // true
  console.log(Animal.prototype);
  console.log(Animal.prototype.eat);
  console.log(animal1.prototype);
  console.log(animal2);

  // Animal.prototype.eat = function () {
  //   console.log("Eating");
  // };
  animal1.__proto__.eat = function () {
    console.log("Eating from animal1");
  };

  Animal.prototype.values = [];

  animal1.values.push(1);
  animal2.values.push(2);

  console.log(animal1.values); // [1, 2]

  console.log(animal2.eat); // undefined
};

const documentEventsExample = () => {
  const body = document.body;
  body.addEventListener("click", (e) => {
    console.log("Body click");
  });
  body.addEventListener("mousedown", (e) => {
    console.log("Body mousedown");
  });
  body.addEventListener("mouseup", (e) => {
    console.log("Body mouseup");
  });
};

const initFormExample = () => {
  document.getElementById("recollection-form").classList.toggle("hidden");

  document
    .getElementById("recollection-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      console.log(data);
    });
};
