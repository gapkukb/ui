import icon from "./icon";
import Vue from "vue";

class Listener {
  static init = 0;
  static pending = 1;
  static success = 2;
  static fail = 3;
  constructor(option) {
    this.el = option.el;
    this.src = option.src;
    this.parent = option.parent;
    option = option.lazyOption;
    this.preload = option.preload;
    this.loading = option.loading;
    this.error = option.error;
    this.state = Listener.init;
  }
  isVisible() {
    let parent = this.parent.getBoundingClientRect();
    let self = this.el.getBoundingClientRect();
    return self.top - parent.height * this.preload < parent.top;
  }
  load() {
    this.state = Listener.pending;
    this.el.src = this.loading;
    this.loadImage(
      () => {
        this.state = Listener.success;
        this.el.src = this.src;
      },
      () => {
        this.state = "failure";
        this.el.src = this.error;
      }
    );
  }
  loadImage(resolve, reject) {
    const image = new Image();
    image.src = this.src;
    image.addEventListener("load", resolve);
    image.addEventListener("error", reject);
  }
}

class Lazy {
  constructor(Vue, option) {
    this.Vue = Vue;
    this.options = option;
    this.queue = [];
    this.hasBind = false;
    this.parent = undefined;

    this.handler = this.throttle(this.handler.bind(this), 200);
  }
  add(el, binding) {
    this.Vue.nextTick(() => {
      this.parent = this.findParent(el);
      if (!this.hasBind) {
        this.parent.addEventListener("scroll", this.handler);
        this.hasBind = true;
      }
      const listener = new Listener({
        el,
        src: binding.value,
        parent: this.parent,
        lazy: this.options,
      });
      this.queue.push(listener);
      this.handler();
    });
  }
  handler() {
    this.queue.forEach((item) => {
      if (item.isVisible() && item.state === Listener.init) {
        item.load();
      }
    });
  }
  throttle(fn, wait = 0) {
    let timer = null;
    return function(...params) {
      if (timer) return;
      timer = setTimeout(() => {
        fn(...params);
        timer = null;
      }, wait);
    };
  }
  destroy() {
    this.parent.removeEventListener("scroll", this.handler);
    this.queue = [];
    this.hasBind = false;
  }
  findParent(el) {
    let parent = el.parentNode;
    while (parent && parent !== window) {
      const style = getComputedStyle(parent);
      var over = style.overflow + style.overflowX + style.overflowY;
      if (/scorll|auto/.test(over)) break;
      parent = parentNode;
    }
    return parent;
  }
}

Vue.directive("lazy", {
  bind: lazy.add.bind(lazy),
  unbind: lazy.destroy.bind(lazy),
});

function withUnit(x, unit) {
  return !x && x !== 0 ? null : Number(x) ? x + (unit || "px") : x;
}
export default {
  components: {
    icon,
  },
  props: {
    src: String,
    fit: String,
    alt: String,
    width: [Number, String],
    height: [Number, String],
    radius: [Number, String],
    round: Boolean,
    lazy: Boolean,
    error: Boolean,
    loading: Boolean,
    errorIcon: {
      type: String,
      default: "jilu",
    },
    loadingIcon: {
      type: String,
      default: "jilu",
    },
    iconPrefix: String,
  },
  methods: {
    withUnit(x, unit) {
      return withUnit(x, unit);
    },
  },
  template: `
    <div class="ui-image" :class="{'ui-image--round':round}" :style="{'border-radius':withUnit(radius),width:withUnit(width),height:withUnit(height)}">
      <slot v-if="error" name="error"><icon class="ui-image__error" :name="errorIcon"/></slot>
      <slot v-else-if="loading" name="loading"><icon class="ui-image__loading" :name="loadingIcon"/></slot>
      <slot v-else><img class="ui-image__img" :src="src" :style="{'object-fit':fit}"/></slot>


    </div>
  `,
};
