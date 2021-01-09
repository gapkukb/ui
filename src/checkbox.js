Vue.component("ui-option", {
  name: "aa",
  props: {
    value: Boolean | undefined,
    label: [String, Number],
    labelDisabled: Boolean,
    disabled: Boolean,
    radio: Boolean,
    hidden: Boolean,
    icon: {
      type: String,
      default: "emoji1",
    },
    iconChecked: {
      type: String,
      default: "emoji3",
    },
    provide: {
      type: null,
    },
  },
  data() {
    return {
      model: this.value,
      type: this.radio ? "radio" : "checkbox",
    };
  },

  methods: {
    on() {
      if (this.disabled) return;
      var d = this.provide || !this.value;
      this.$emit("input", d);
      this.$emit("change", d);
    },
  },
  render(c) {
    return c(
      "div",
      {
        class: ["ui-option", this.disabled && "ui-option--disabled"],
        on: {
          click: this.on,
        },
      },
      [
        c(
          "span",
          {
            class: ["ui-option__label"],
            on: this.labelDisabled
              ? {
                  click(e) {
                    e.stopPropagation();
                  },
                }
              : null,
          },
          this.label
        ),
        c("ui-icon", {
          class: ["ui-option__icon"],
          props: {
            name: this.value ? this.iconChecked : this.icon,
          },
        }),
      ]
    );
  },
});

Vue.component("ui-checkbox-group", {
  name: "checkbox-group",
  props: {
    value: Array,
    data: Array,
    radio: Boolean,
  },
  methods: {
    change(item) {
      if (this.radio) {
        this.data.forEach((i) => (i.checked = false));
        item.checked = true;
        this.$emit("input", item.value);
        this.$emit("change", item.value);
      } else {
        let ary = this.data.filter((i) => i.checked).map((i) => i.value);
        this.$emit("input", ary);
        this.$emit("change", ary);
      }
    },
  },
  render(c) {
    console.log(this.$children);
    console.log(this.$slots.default);
    return c(
      "div",
      {
        staticClass: "ui-options ui-options--horizon",
      },
      this.$slots.default
        ? this.$slots.default.map((item) => {
            item.text = "123213";
            return item;
          })
        : this.data.map((item, index) =>
            c("ui-option", {
              attrs: {
                label: item.label,
              },
            })
          )
    );
  },
});

Vue.component("dropdown", {
  name: "dropdown",
  provide() {
    return { tabs: this };
  },
  props: {},
  data() {
    return {
      navList: [],
    };
  },
  watch: {},
  methods: {},
  template: `
    <div class="ui-tab">
      <div class="ui-tab__navs">
        <div
          v-for="(item,index) in navList"
          :key="index"
          class="ui-tab__nav"
          @click="handle(index)"
          :class="{'ui-tab__active':activeKey === (item.name||index),'ui-tab__disabled':item.disabled}"
        >{{item.label}}</div>
      </div>
      <div class="ui-tab__bodies">
        <slot></slot>
      </div>
    </div>`,
});
