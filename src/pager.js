import icon from "./icon";
const initNumberType = (n) => ({
  type: Number,
  default: n,
});
const ctrl = {
  PREV: -1, //前一页
  NEXT: -2, //后一页
  UP: -3, // 向前翻页
  DOWN: -4, //向后翻页
};
const ctrlMap = {
  "-1": "prev",
  "-2": "next",
  "-3": "up",
  "-4": "down",
};
function makePager(current, pages, max, ellipses) {
  current = current > pages ? pages : current;
  var ret = [ctrl.PREV],
    len = Math.min(pages, max),
    middle = Math.max(1, len / 2),
    begin = Math.min(Math.max(current - middle + 1, 1), pages - len + 1);

  for (let i = 0; i < len; i++) {
    ret.push(i + begin);
  }
  if (ellipses && pages > max) {
    if (current > middle) {
      ret.splice(1, 2, 1, ctrl.UP);
    }
    if (current < pages - middle) {
      ret.splice(len - 1, 2, ctrl.DOWN, pages);
    }
  }
  ret.push(ctrl.NEXT);
  return ret;
}

export default {
  components: { icon },
  props: {
    value: initNumberType(1),
    total: initNumberType(0),
    size: initNumberType(0),
    pages: initNumberType(0),
    max: initNumberType(10),
    step: initNumberType(5),
    sizeOption: Array,
    jumper: Boolean,
    ellipses: {
      type: Boolean,
      default: true,
    },
    buttonClassName: String,
    formater: Function,
    onChange: Function,
    showTotal: {
      type: Boolean,
      default: true,
    },
    totalOnRight: Boolean,
    textOption: {
      type: Object,
      default() {
        return {
          prev: {
            icon: "jilu",
            label: "上一页",
            title: "上一页",
          },
          next: {
            icon: "jingbao",
            label: "下一页",
            title: "下一页",
          },
          up: {
            icon: "jingbao",
            label: "...",
            title: "向后#页",
          },
          down: {
            icon: "jingbao",
            label: "...",
            title: "向前#页",
          },
        };
      },
    },
  },
  computed: {
    _pages() {
      return this.pages || Math.ceil(this.total / this.size) || 1;
    },
  },
  methods: {
    click(item, index) {
      var cur = this.value;
      if (item === ctrl.UP) {
        cur -= this.step;
      } else if (item === ctrl.DOWN) {
        cur += this.step;
      } else if (item === ctrl.PREV) {
        cur -= 1;
      } else if (item === ctrl.NEXT) {
        cur += 1;
      } else {
        cur = item;
      }
      this.$emit("input", cur);
    },
  },
  render(c) {
    var current = this.value;
    var pages = makePager(current, this._pages, this.max, this.ellipses);
    var nodes = pages.map((item, index) => {
      var special = ctrlMap[item.toString()];
      var option;
      if (special) {
        option = this.textOption[special];
      }
      return c(
        "button",
        {
          staticClass: "ui-pager__button",
          attrs: {
            disabled:
              (item === ctrl.PREV && current === 1) ||
              (item === ctrl.NEXT && current === this._pages) ||
              item === current,
            title: option ? option.title.replace("#", this.step) : item,
          },
          class: {
            "ui-pager__active": item === current,
            "ui-pager__prev": item === ctrl.PREV,
            "ui-pager__next": item === ctrl.NEXT,
            "ui-pager__up": item === ctrl.UP,
            "ui-pager__down": item === ctrl.DOWN,
          },
          key: item,
          on: {
            click: function() {
              _this.click(item, index);
            },
          },
        },
        item >= 0
          ? item
          : [
              item === ctrl.UP || item === ctrl.DOWN ? c("span", option.label) : null,
              c("icon", { props: { name: option.icon } }),
            ]
      );
    });
    this.formater &&
      nodes.unshift(
        c(
          "div",
          { staticClass: "ui-pager__total", style: { order: !this.totalOnRight ? 9 : false } },
          this.formater(this.total, this.size, this.value)
        )
      );
    this.sizeOption &&
      nodes.push(
        c(
          "div",
          {
            staticClass: "ui-pager__sizes",
          },
          this.sizeOption.map((i) =>
            c(
              "div",
              {
                staticClass: "ui-pager__size",
              },
              `${i}条/页`
            )
          )
        )
      );
    this.jumper &&
      nodes.push(
        c(
          "div",
          {
            staticClass: "ui-pager__jumper",
          },
          ["跳至", c("input", { staticClass: "ui-pager__filed" }), "页"]
        )
      );
    return c(
      "div",
      {
        staticClass: "ui-pager",
      },
      nodes
    );
  },
};
