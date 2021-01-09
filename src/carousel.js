import icon from "./icon";
function withUnit(x, unit) {
  return !x && x !== 0 ? null : Number(x) ? x + (unit || "px") : x;
}
var numberLike = [String, Number];
export const SliderItem = {
  props: {
    tag: String,
  },
  mounted() {
    this.$parent.init();
  },
  beforeDestroy() {
    this.$parent.init();
  },
  render(c) {
    return c(this.tag || "div", { staticClass: "ui-slider__item" }, this.$slots.default);
  },
};
export default {
  components: { icon },
  props: {
    autoplay: numberLike,
    duration: {
      type: numberLike,
      default: "300ms",
    },
    initial: numberLike,
    interval: {
      type: numberLike,
      default: 1000,
    },
    width: numberLike,
    height: numberLike,
    prevIcon: {
      type: String,
      default: "jilu",
    },
    nextIcon: {
      type: String,
      default: "jilu",
    },
    loop: Boolean,
    show: Boolean,
    vertical: Boolean,
    touchable: Boolean,
    stop: Boolean,
    lazy: Boolean,
    indicator: String,
  },
  data() {
    return {
      timer: null,
      index: 0,
      moving: false,
      length: 0,
      initTimer: null,
    };
  },
  computed: {
    w() {
      return withUnit(this.width);
    },
    h() {
      return withUnit(this.height);
    },
    dotIndex() {
      return (this.index + this.length) % this.length;
    },
  },
  methods: {
    go(step) {
      if (this.moving) return;
      this.index += step;
      this.goto(this.index);
    },
    goto(i, silent = false) {
      if (this.moving) return;
      this.moving = !silent;
      this.moveBefore();
      var x = i * 100 * -1;
      this.$refs.track.style.cssText = `transition-duration:${silent ? 0 : this.duration};transform: translateX(${x}%)`;
    },
    next() {
      this.index++;
      this.goto(this.index);
      this.timer = setTimeout(this.next, Number(this.interval));
    },
    autoPlay() {
      this.clear();
      if (this.length <= 1) return;
      this.next();
    },
    withUnit(x, unit) {
      return withUnit(x, unit);
    },
    moveBefore() {
      if (this.index < 0) {
        this.$refs.track.lastChild.style.transform = `translateX(${this.length * 100 * -1}%)`;
      } else if (this.index === this.length) {
        this.$refs.track.firstChild.style.transform = `translateX(${this.length * 100}%)`;
      }
    },
    moveEnd() {
      this.moving = false;
      if (this.index < 0) {
        this.$refs.track.lastChild.style.transform = ``;
        this.index = this.length - 1;
      } else if (this.index === this.length) {
        this.$refs.track.firstChild.style.transform = ``;
        this.index = 0;
      }
      this.goto(this.index, true);
    },
    clear() {
      if (this.timer) clearTimeout(this.timer);
    },
    init() {
      this.length = (this.$slots.default || []).length;
      this.clear();
      if (this.initTimer) clearTimeout(this.initTimer);
      if (this.length <= 1) return;
      this.initTimer = setTimeout(() => {
        this.autoPlay();
        this.index = 0;
        this.moving = false;
        this.goto(0, true);
      }, 300);
    },
  },
  mounted() {
    this.init();
  },
  render(c) {
    var _this = this;
    return c(
      "div",
      {
        staticClass: "ui-slider",
        style: {
          width: withUnit(this.width),
          height: withUnit(this.height),
        },
        on: {
          mouseenter: this.clear,
          mouseleave: this.autoPlay,
        },
      },
      [
        this.length > 1 &&
          (this.$slots.prev ||
            c(
              "div",
              {
                staticClass: "ui-slider__ctrl ui-slider__prev",
              },
              [
                c("icon", {
                  attrs: {
                    name: this.prevIcon,
                  },
                  on: {
                    click: function() {
                      _this.go(-1);
                    },
                  },
                }),
              ]
            )),
        this.length > 1 &&
          (this.$slots.next ||
            c(
              "div",
              {
                staticClass: "ui-slider__ctrl ui-slider__next",
              },
              [
                c("icon", {
                  attrs: {
                    name: this.nextIcon,
                  },
                  on: {
                    click: function() {
                      _this.go(1);
                    },
                  },
                }),
              ]
            )),
        c(
          "div",
          {
            ref: "track",
            staticClass: "ui-slider__track",
            on: {
              transitionend: this.moveEnd,
            },
          },
          this.$slots.default
        ),
        c(
          "div",
          {
            staticClass: "ui-slider__dots",
          },
          (this.$slots.default || []).map((_, i) =>
            c(
              "i",
              {
                key: i,
                staticClass: "ui-slider__dot",
                class: {
                  "ui-slider__active ": i === this.dotIndex,
                },
              },
              i + "," + this.dotIndex
            )
          )
        ),
      ]
    );
  },
};
