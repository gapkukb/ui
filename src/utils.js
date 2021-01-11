export const assert = (function() {
  const type = Object.create(null);
  type.null = (x) => x === null;
  type.undefined = (x) => x === undefined;
  type.nil = (x) => type.null(x) || type.undefined(x);
  type.def = (x) => !type.nil(x);
  type.number = (x) => type.def(x) && (!(isNaN(x) && isFinite(x) && typeof x === "number") || x instanceof Number);
  type.string = (x) => type.def(x) && (typeof x === "string" || x instanceof String);
  type.function = (x) => type.def(x) && (typeof x === "function" || x instanceof Function);
  type.boolean = (x) => type.def(x) && (typeof x === "boolean" || x instanceof Boolean);
  type.array = (x) => type.def(x) && Array.isArray(x);
  type.object = (x) => ({}.toString.call(x) === "[object Object]");
  type.typeof = (x, X) => type.def(x) && x instanceof X;
  type.set = (x) => type.assert(x, Set);
  type.map = (x) => type.assert(x, Map);
  type.date = (x) => type.assert(x, Date);
  type.empty = (x) => {
    if (type.array(x) || type.string(x)) return x.length === 0;
    if (type.map(x) || type.set(x)) return x.size === 0;
    if (type.object(x)) return Object.keys(x).length === 0;
    return false;
  };
  return type;
})();

export function unit(x, unit = "px") {
  return !x && x !== 0 ? null : Number(x) ? x + unit : x;
}

export function prevent(e, stop) {
  if (typeof e.cancelable !== "boolean" || e.cancelable) e.preventDefault();
  if (stop) stop(e);
}

Object.assign =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

export const NumberLike = [String, Number];

function Bem(block, extend) {
  this.b = extend ? block : "ui-" + block;
}
Bem.prototype = {
  _(x, sep) {
    var s = "";
    for (let i = 0; i < x.length; i++) {
      if (!x[i]) continue;
      s += " " + this.b + sep + x[i];
    }
    return s.trim();
  },
  e() {
    return this._(arguments, "__");
  },
  m() {
    return this._(arguments, "--");
  },
  ext(e) {
    return new Bem(this.e(e), true);
  },
  mix() {
    return this.b + " " + this.join(arguments);
  },
  join() {
    return Array.prototype.join.call(arguments, " ");
  },
};
export function simpleType(type, value) {
  return {
    type: type,
    default: value || (type === String ? "" : type === Number ? 0 : type === Boolean ? false : null),
  };
}
export function complexType(type, value) {
  return {
    type: type,
    default() {
      return value || (type === Array ? [] : type === Object ? {} : null);
    },
  };
}
export const NS = (b) => new Bem(b);

export const randomId = (n = 8) => {
  return (
    Math.random()
      .toString(32)
      .slice(-1 * n + 4) +
    Date.now()
      .toString(32)
      .slice(-4)
  );
};

export function deepclone(data) {
  let clone, i;
  if (assert.array(data)) {
    clone = [];
    for (i = 0; i < data.length; i++) clone.push(deepclone(data[i]));
  } else if (assert.object(data)) {
    clone = {};
    for (i in data) clone[i] = deepclone(data[i]);
  } else {
    return data;
  }
  return clone;
}

export var isImg = (function() {
  var imgPathReg = /\.(png|gif|svg|jpg|webp)$/;
  return function(s) {
    return imgPathReg.test(s);
  };
})();

export const CONST = {
  RENDER_TYPE: {
    INDEX: 0,
    HTML: 1,
    SELECTION: 2,
    NORMAL: 3,
    EXPAND: 4,
    RENDER: 5,
    SLOT: 6,
  },
  TABLE_FRAME: {
    NONE: "void",
    PUREROWS: "hsides",
    PURECOLS: "vsides",
  },
};
