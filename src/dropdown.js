import icon from "./icon";

export const DropdownItem = {
  name: "dropdown-item",
  components: {
    icon,
  },
  props: {
    divided: Boolean,
    disabled: Boolean,
    icon: String,
    label: String,
    selectedIcon: String,
    rightIcon: Boolean,
    value: null,
    prefix: String,
  },
  data() {
    return {
      selected: false,
    };
  },
  methods: {
    handler() {
      if (this.disabled) return;
      this.selected = !this.selected;
      this.$parent.dispatch(this.label, this.value, this);
      // this.$parent.dispatch(this);
    },
  },
  render(c) {
    return c(
      "div",
      {
        staticClass: "ui-dropdown__item",
        class: {
          "ui-dropdown__divided": this.divided,
          "ui-dropdown__disabled": this.disabled,
          "ui-dropdown__selected": !this.disabled && this.selected,
          "ui-dropdown__item--right": this.rightIcon,
        },
        on: {
          click: this.handler,
        },
      },
      [
        c("icon", {
          attrs: {
            name: this.selected ? this.selectedIcon : this.icon,
          },
        }),
        this.$slots.default || this.label,
      ]
    );
  },
};
export const Dropdown = {
  name: "dropdown",
  components: {
    icon,
    DropdownItem,
  },
  data() {
    return {
      filter: "",
      active: false,
      timer: 0,
    };
  },
  props: {
    trigger: String,
    autoClose: {
      type: Boolean,
      default: true,
    },
    title: String,
    data: Array,
    icon: String,
    selectedIcon: String,
    rightIcon: Boolean,
    disabled: Boolean,
    mutiple: Boolean,
    value: null,
    formater: Function,
  },
  watch: {
    value(val) {
      console.log(val);
      this.selectedChilren();
    },
    active(val) {
      if (val) {
        var rect = this.$el.getBoundingClientRect();
        var style = {};
        style[rect.x < window.innerWidth / 2 ? "left" : "right"] = 0;
        style[rect.y < window.innerHeight / 2 ? "top" : "bottom"] = "100%";
        this.style = style;
      }
    },
  },
  methods: {
    bind(e) {
      if (!this.$el.contains(e.target)) this.active = false;
    },
    dispatch(label, value, child) {
      var raw = child.selected;
      var v = value || label;
      var origin;
      if (this.mutiple) {
        origin = Array.isArray(this.value) ? this.value : [];
        var i = origin.indexOf(v);
        if (i !== -1) {
          origin.splice(i, 1);
        } else {
          origin.push(v);
        }
      } else {
        this.$children.forEach((i) => (i.selected = false));
        child.selected = raw;
        origin = raw ? v : null;
      }
      this.$emit("input", origin);
    },
    selectedChilren() {
      this.$children.forEach((i) => {
        var v = i.value || i.label;
        if (this.mutiple) {
          i.selected = this.value.indexOf(v) !== -1;
        } else {
          i.selected = v === this.value;
        }
      });
    },
  },
  mounted() {
    this.selectedChilren();
    document.addEventListener("click", this.bind, false);
  },
  beforeDestory() {
    document.removeEventListener("click", this.bind, false);
  },
  template: `
    <div class="ui-dropdown" :class="{'ui-dropdown--disabled':disabled}" @mouseleave="active = false">
      <div class="ui-dropdown__rel"  @click="active = true" @mouseenter="active = true">
        <slot name="rel">{{title}}<icon name="jingbao" class="ui-dropdown__icon"></icon></slot>
      </div>
      <transition name="ui-dropdown">
      <div class="ui-dropdown__main" :class="bodyClass" ref="body"  v-model="active">
        <div class="ui-dropdown__inner">
          <slot name="header"></slot>
          <div class="ui--pretty-bar ui-dropdown__body">
            <slot></slot>
          </div>
          <slot name="footer"></slot>
        </div>
      </div>
      </transition>
    </div>
  `,
};
