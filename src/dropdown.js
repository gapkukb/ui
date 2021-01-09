import icon from "./icon";

const DropdownItem = {
  name: "dropdown-item",
  components: {
    icon,
  },
  props: {
    divided: Boolean,
    selected: Boolean,
    disabled: Boolean,
    icon: String,
    selectedIcon: String,
    rightIcon: Boolean,
  },
  methods: {
    handler() {
      if (this.disabled) return;
      this.$emit("click", this.value, this.id);
    },
  },
  render(c) {
    return c(
      "div",
      {
        staticClass: "ui-dropdown__item ui--pretty-bar",
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
        this.label,
        this.$slots.default,
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
      style: {},
      timer: 0,
      list: this.makeData(),
      click: false,
    };
  },
  props: {
    trigger: String,
    autoClose: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "请选择",
    },
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
    data() {
      this.list = this.makeData();
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
    makeData() {
      return (this.data || []).map((item) => {
        if (typeof item === "object")
          return this.creatItem(item.label, item.value, item.disabled, item.divided, item.selected);
        return this.creatItem(item, item);
      });
    },
    creatItem(label, value, disabled, divided, selected) {
      return {
        label: label || "",
        value: value || "",
        disabled: disabled || false,
        divided: divided || false,
        selected: selected || false,
      };
    },
    handler(i) {
      var f = !this.list[i].selected;
      if (this.autoClose) {
        this.active = false;
      }
      if (!this.mutiple) {
        this.list.forEach((i) => {
          i.selected = false;
        });
      }
      this.list[i].selected = f;
      this.$emit("input", this.mutiple ? this.list.filter((i) => i.selected).map((i) => i.value) : f);
    },
    toggle(flag) {
      this.active = typeof flag === "boolean" ? flag : !this.active;
    },
    bind(e) {
      if (!this.$el.contains(e.target)) this.active = false;
    },
  },
  mounted() {
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
      <div class="ui-dropdown__main" ref="body"  v-show="active" :style="style">
        <div class="ui-dropdown__inner">
          <slot name="title"></slot>
          <div class="ui-beauty ui-dropdown__body">
            <slot>
              <dropdown-item
                v-for="(item,index) in list"
                :key="index"
                :disabled ="item.disabled"
                :selected ="item.selected"
                :divided  = "item.divided"
                :icon="icon"
                :selected-icon="selectedIcon"
                :right-icon="rightIcon"
                @click="handler(index)"
              >{{formater?formater(item.label):item.label}}</dropdown-item>
            </slot>
          </div>
          <slot name="footer"></slot>
        </div>
      </div>
      </transition>

    </div>

  `,
};
