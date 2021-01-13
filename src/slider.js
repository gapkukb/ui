import icon from "./icon";
import { NumberLike, simpleType } from "./utils";
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
    autoplay: Boolean,
    duration: simpleType(NumberLike, "300ms"),
    interval: simpleType(NumberLike, 2000),
    width: NumberLike,
    height: NumberLike,
    prevIcon: {
      type: String,
      default: "jilu",
    },
    nextIcon: {
      type: String,
      default: "jilu",
    },
    loop: Boolean,
    showControl: Boolean,
    vertical: Boolean,
    touchable: Boolean,
    stop: Boolean,
    lazy: Boolean,
    showIndicator: Boolean,
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
    vitual() {
      return this.$children.length + 2;
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
      var track = this.$refs.track;
      if (this.index < 0) {
        this.translate(track.lastChild, this.length * 100 * -1);
      } else if (this.index === this.length) {
        this.translate(track.firstChild, this.length * 100);
      }
      var x = i * 100 * -1;
      track.style.transitionDuration = silent ? "0ms" : this.duration;
      this.translate(track, x);
    },
    translate(el, value) {
      el.style.transform = `translateX(${value}%)`;
    },
    next() {
      this.timer = setTimeout(() => {
        this.index = (this.index + 1) % this.vitual;
        this.goto(this.index);
        this.next();
      }, Number(this.interval));
    },
    moveEnd() {
      this.moving = false;
      var silent = false;
      if (this.index < 0) {
        this.$refs.track.lastChild.style.transform = "";
        this.index = this.length - 1;
        this.goto(this.index, true);
      } else if (this.index === this.length) {
        this.$refs.track.firstChild.style.transform = "";
        this.index = 0;
        silent = true;
      }
      silent ? this.goto(this.index, true) : this.$emit("changed", this.index);
    },
    clear() {
      clearTimeout(this.timer);
    },
    start() {
      if (this.length <= 1) return;
      this.next();
    },
    init() {
      this.length = this.$children.length;
      clearTimeout(this.initTimer);
      clearTimeout(this.timer);
      if (this.length <= 1) return;
      this.initTimer = setTimeout(() => {
        this.index = 0;
        this.moving = false;
        this.goto(0, true);
        this.next();
      }, 0);
    },
  },
  mounted() {
    this.init();
  },
  template: `
    <div class="ui-slider" :style={width:w,height:h} @mouseenter="clear"  @mouseleave="start()">
      <slot name="prev" v-if="length>1">
        <div class="ui-slider__ctrl ui-slider__prev" @click="go(-1)">
          <ui-icon icon="prevIcon"></ui-icon>
        </div>
      </slot>
      <slot name="next" v-if="length>1">
        <div class="ui-slider__ctrl ui-slider__next" @click="go(1)">
          <ui-icon icon="nextIcon"></ui-icon>
        </div>
      </slot>
      <div ref="track" class="ui-slider__track" @transitionend="moveEnd"><slot/></div>
      <div class="ui-slider__dots">
      {{counts}}
        <i v-for="i in length" class="slider__dot" :class="{'ui-slider__active': i === dotIndex}"></i>
      </div>
  `,
  render(c) {
    var _this = this;
    this.length = (this.$slots.default || []).length;
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
          mouseleave: this.start,
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
                    icon: this.prevIcon,
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
                    icon: this.nextIcon,
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
