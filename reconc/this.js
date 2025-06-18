function sayHello() {
  console.log(this);
}

// undefined -> strict mode
// sayHello(); undefined -> strict mode

/////////////////////////////////////////////////////

const obj = {
  name: "John",
  greet: () => {
    console.log(this.name);
  },
};

// undefined -> strict mode
// greetFn(); undefined -> strict mode

const greetFn = obj.greet;
// greetFn();

/////////////////////////////////////////////////////

const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

// setTimeout(user.greet.bind(user), 1000);

/////////////////////////////////////////////////////

const module = {
  x: 42,
  getX: function () {
    return this.x;
  },
};

let retrieveX = module.getX;
retrieveX = retrieveX.bind(module);
// 42 fixed
// console.log(retrieveX());

/////////////////////////////////////////////////////

const person = {
  name: "Mike",
  sayHi: function () {
    console.log(`Hi, I’m ${this.name}`);
  },
};

const person2 = { name: "Sara" };
person2.sayHi = person.sayHi;
// Hi, I’m Sara
// person2.sayHi();

/////////////////////////////////////////////////////

const team = {
  members: ["Jane", "Bill"],
  teamName: "Super Team",
  getTeamMembers() {
    return this.members.map((member) => `${member} is on ${this.teamName}`);
  },
};

// ["Jane is on Super Team", "Bill is on Super Team"]
// console.log(team.getTeamMembers());

/////////////////////////////////////////////////////

var length = 10;
function fn() {
  console.log(this.length);
}

const obj1 = {
  length: 5,
  method: function (fn) {
    debugger;
    fn();
    arguments[0]();
  },
};

// 10 -> fn() -> global object
// 2 -> arguments[0]() -> obj1 object

// obj1.method(fn, 1);

/////////////////////////////////////////////////////

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}

const c = new Counter();
const inc = c.increment;

// undefined
// inc();

/////////////////////////////////////////////////////

const obj2 = {
  name: "Timer",
  start() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};

// binding the function to obj2
// obj2.start();

/////////////////////////////////////////////////////

const obj4 = {
  name: "Obj",
  method: function () {
    const arrow = () => {
      console.log(this.name);
    };
    arrow.bind({ name: "Bound" })();
  },
};

// "Obj" -> arrow function uses lexical this
// obj4.method();

/////////////////////////////////////////////////////

// const context = {
//   value: "Context",
//   regular: function () {
//     console.log(this.value);
//   },
//   arrow: () => {
//     console.log(this.value);
//   },
// };

// context.regular();
// context.arrow();

const context = {
  value: "Context",
  regular() {
    console.log(this.value);

    this.test = 1;

    this.arrow = () => {
      console.log(this.value);
    };

    return () => {
      console.log(this.value);
    };
  },
};

context.regular()();
context.arrow(); // "Context" -> arrow function uses lexical this
context.regular.arrow(); // "Context" -> arrow function uses lexical this
