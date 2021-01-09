var NumberLike = [String, Number];
var NumberLikeObject = [].concat(NumberLike, Object);
function unit(x, unit) {
  return !x && x !== 0 ? null : Number(x) ? x + (unit || "px") : x;
}
function merge() {
  var ret = arguments[0] || {};
  for (let i = 1; i < arguments.length; i++) {
    var e = arguments[i];
    for (var attr in e || {}) {
      ret[attr] = e[attr];
    }
  }
}
export var Row = {
  name: "row",
  provide() {
    return {
      inlineGap: this.inlineGap,
      qs: this.qs,
    };
  },
  props: {
    gap: String,
    inlineGap: NumberLike,
    type: String,
    multiple: String,
    single: String,
    align: String,
    justify: String,
    nowrap: Boolean,
    inline: Boolean,
    reverse: Boolean,
    column: Boolean,
  },
  data() {
    return {
      sizes: ["xxs", "xs", "sm", "md", "lg", "xl"],
    };
  },
  methods: {
    qs(params, prefix) {
      if (!params && params !== 0) return {};

      return params
        .replace(/=/g, "--")
        .split(",")
        .filter((i) => i)
        .reduce((acc, i) => {
          let joint = i.indexOf("--") === -1 ? "--" : "-";
          acc[prefix + joint + i] = true;
          return acc;
        }, {});
    },
    fill(prop, o, prefix) {
      if (!o || !prop) return;
      o[prefix + prop] = true;
    },
  },
  render(c) {
    var qs = {},
      styles = {};
    if (this.inlineGap) {
      var n = unit(this.inlineGap);
      styles = {
        "margin-bottom": "-" + n,
        "margin-right": "-" + n,
      };
    } else {
      qs = this.qs(this.gap, "ui-gap");
    }
    var classes = {
      "ui-row": !this.inline,
      "ui-row-inline": !this.inline,
      "ui-row--nowrap": this.nowrap,
      "ui-row--reverse": this.reverse,
      "ui-row--column": this.column,
    };
    classes["ui-justify--" + this.justify] = this.justify;
    this.fill(this.justify, classes, "ui-justify--");
    this.fill(this.align, classes, "ui-align--");
    this.fill(this.multiple, classes, "ui-multi--");
    this.fill(this.single, classes, "ui-single--");
    merge(classes, qs);
    //gap format : ui-gap[-media query][-direction]--size
    // such as: ui-gap--xs ui-gap-xs--xs ui-gap-xs-y-sm ui-gap-y-xs
    return c(
      "div",
      {
        class: classes,
        style: styles,
      },
      this.$slots.default
    );
  },
};
export const Column = {
  name: "column",
  inject: ["qs", "inlineGap"],
  props: {
    span: NumberLikeObject,
    order: NumberLike,
    offset: NumberLikeObject,
    at: String,
    classes: String,
    styles: Object,
  },
  render(c) {
    var styles = merge({ order: this.order }, this.styles),
      classes = {};
    classes["ui-at-/-" + this.at] = !!this.at;
    merge(classes, this.qs(this.span, "ui-col"), this.qs(this.offset, "ui-offset"));
    if (this.inlineGap) {
      var n = unit(this.inlineGap);
      merge(styles, {
        "padding-bottom": n,
        "padding-right": n,
      });
    }

    return c(
      "div",
      {
        staticClass: "ui-col",
        class: classes,
        style: styles,
      },
      [c("div", { class: this.classes }, this.$slots.default)]
    );
  },
};
