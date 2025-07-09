const parse = (csv) => {
  const rows = csv.split("\n").filter((v) => v !== "");
  const fields = rows[0].split(",");
  const EMPTY_FIELD = "EMPTY_FIELD";

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const preparedRow = rows[i].replaceAll(",,", ",EMPTY_FIELD,");
    let newObject = {};

    preparedRow.split(",").forEach((v, i) => {
      if (v !== EMPTY_FIELD) {
        newObject[fields[i]] = v;
      } else {
        newObject[fields[i]] = undefined;
      }
    });

    result.push(newObject);
  }

  return result;
};

/////

const sortOperations = (data) => {
  data.sort((a, b) => new Date(b.date) - new Date(a.date));

  let result = {};

  data.forEach((v) => {
    const d = new Date(v.date);
    const year = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push({
      ...v,
      date: `${mm}-${dd}`,
    });
  });

  return result;
};

////

Array.prototype.some = function (cb) {
  if (typeof cb !== "function") {
    throw Error();
  }

  for (let i = 0; i < this.length; i++) {
    if (this[i] && cb(this[i], i, this)) {
      return true;
    }
  }

  return false;
};

///////

const str = "адрес карп кума куст мир мука парк рим среда стук рост сорт трос";

const getAnagrams = (s) => {
  const words = s.split(" ");
  let cache = new Map();

  words.forEach((w) => {
    const sortedWord = w.split("").sort().join();
    const currentValue = cache.get(sorted);

    if (currentValue) {
      cache.set(sortedWord, [...currentValue, w]);
    } else {
      cache.set(sortedWord, [w]);
    }
  });

  return Array.from(cache.values());
};

//////

function spy(fn) {
  let calls = [];
  let calledTimes = 0;

  const spiedFn = function (...args) {
    const result = fn.apply(this, ...args);
    calls.push({
      args,
      result,
      thisArgs: this,
    });
    calledTimes++;
    return result;
  };

  spiedFn.calls = calls;
  spiedFn.calledTimes = calledTimes;
  spiedFn.reset = () => {
    calls = [];
    calledTimes = 0;
  };

  return spiedFn;
}

const obj = {
  x: 10,
  getX() {
    return this.x;
  },
};

obj.getX = spy(obj.getX);

console.log(obj.getX());

///////

const spyProto = {
  calledTimes() {
    return this.calls.length;
  },
  reset() {
    this.calls.length = 0;
  },
};

function spy(fn) {
  const calls = [];

  const spiedFn = function (...args) {
    const result = fn.apply(this, args);
    calls.push({ args, result });
    return result;
  };

  Object.setPrototypeOf(spiedFn, spyProto);
  spiedFn.calls = calls;

  return spiedFn;
}

///////

const getMoney = (amount) => {
  const dict = [5000, 1000, 500, 100, 50];
  let ost = amount;

  const result = dict.reduce((prev, val) => {
    const count = Math.floor(ost / val);
    prev[val] = count;
    ost = ost - count * val;
    return prev;
  }, {});

  return ost > 0 ? null : result;
};

/////

const getMoneyWithLimits = (amount, limit) => {
  const dict = Object.keys(limit).sort((a, b) => Number(b) - Number(a));
  let ost = amount;

  const result = dict.reduce((prev, val) => {
    let count = Math.floor(ost / val);
    if (count > limit[val]) {
      count = limit[val];
    }
    prev[val] = count;
    ost = ost - count * val;
    return prev;
  }, {});

  return ost > 0 ? null : result;
};

/////

const throttle = (fn, delay) => {
  let isCalled = false;

  return function (...args) {
    if (!isCalled) {
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, delay);
      return fn.apply(this, args);
    }
  };
};

/////

const toQueryString = (params) => {
  const encode = encodeURIComponent;

  const build = (obj, prefix = "") => {
    const entries = [];

    for (const key in obj) {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        entries.push(...build(value, fullKey));
      } else {
        entries.push(`${encode(fullKey)}=${encode(value)}`);
      }
    }

    return entries;
  };

  return build(params).join("&");
};

const fromQueryString = (str) => {
  const result = {};

  str.split("&").forEach((pair) => {
    const [rawKey, rawValue] = pair.split("=");
    const keys = decodeURIComponent(rawKey).split(".");
    const value = decodeURIComponent(rawValue);

    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  });

  return result;
};

////////////

const isOverlap = (a1, a2, b1, b2) => {
  return Math.max(a1, b1) <= Math.min(a2, b2);
};

/////////

const mergeStyles = (...args) => {
  return args.reduce((prev, arg) => {
    if (typeof arg === "object" && arg !== null) {
      prev = { ...prev, ...arg };
    }

    return prev;
  }, {});
};

/////////

const debounce = (fn, delay) => {
  let isCalled = false;
  let lastCallArgs = null;

  const callFn = (thisArg, currentArgs) => {
    isCalled = true;
    setTimeout(() => {
      isCalled = false;
      if (lastCallArgs) {
        callFn(thisArg, lastCallArgs);
        lastCallArgs = null;
      }
    }, delay);
    return fn.apply(thisArg, currentArgs);
  };

  return function (...args) {
    if (!isCalled) {
      callFn(this, args);
    } else {
      lastCallArgs = args;
    }
  };
};

const debounceClassic = (fn, delay) => {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

///////

const getTree = (data) => {
  return data.reduce((acc, v) => {
    let current = acc;

    v.split("/").forEach((key) => {
      if (current[key]) {
        current = current[key];
      } else {
        current[key] = {};
        current = current[key];
      }
    });

    return acc;
  }, {});
};
