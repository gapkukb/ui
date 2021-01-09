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
  type.assert = (x, X) => type.def(x) && x instanceof X;
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

function Bem(block) {
  this.b = "ui-" + block;
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
  join() {
    return Array.prototype.join.call(arguments, " ");
  },
};

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

export function columns(cols) {
  var columns = makeId(cols);
  let maxLevel = 1;
  function traverse(column, parent) {
    if (parent) {
      // 如果存在父级，则当前项的层级等于父层级+1，并更新最大层级变量
      var l = (column.level = parent.level + 1);
      if (maxLevel < l) maxLevel = l;
    }
    //设置跨列
    if (column.children) {
      let colspan = 0;
      column.children.forEach((sub) => {
        // 归的时候逐层将父级colspan累加上子项的colspan
        traverse(sub, column);
        colspan += sub.colspan;
      });
      column.colspan = colspan;
    } else {
      // 如果不存在子项,则不需要进行跨列，将colspan设为1
      column.colspan = 1;
    }
  }
  columns.forEach((column) => {
    column.level = 1;
    traverse(column);
  });
  // 初始化行数，总行数等于树深度
  const rows = new Array(maxLevel).fill(0).map(() => Array());
  // 平铺树结构
  getAll(columns).forEach((column) => {
    // 跨行数 = 最大深度减去当前深度
    if (!column.children) column.rowspan = maxLevel - column.level + 1;
    else column.rowspan = 1;
    rows[column.level - 1].push(column);
  });
  return rows;
}

function makeId(columns) {
  return columns.map((item) => {
    if ("children" in item) makeId(item.children);
    item.__id = randomId();
    return item;
  });
}

function getAll(cols) {
  // 将树结构进行平铺
  const result = [];
  cols.forEach((column) => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAll(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
}
