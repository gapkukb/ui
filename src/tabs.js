export const Tab = {
  name: "UiTab",
  props: {
    name: [String, Number],
    label: [String, Number],
    disabled: Boolean,
  },
  data() {
    return {
      show: true,
      render: true,
    };
  },
  mounted() {
    this.$parent.init();
  },
  render(c) {
    if (!this.render) return;
    return c(
      "div",
      {
        staticClass: "ui-tab",
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.show,
            expression: "show",
          },
        ],
      },
      this.$slots.default
    );
  },
};

export const Tabs = {
  name: "UiTabs",
  props: {
    value: [String, Number],
    customActive: Boolean,
    navType: Boolean,
    labelClass: String,
  },
  data() {
    return {
      model: this.value,
      navs: [],
      timer: null,
    };
  },
  watch: {
    value() {
      this.model = this.value;
    },
    model() {
      this.updateState();
    },
  },
  methods: {
    init() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.update, 0);
    },
    getChildren() {
      return this.$children.filter((item) => item.$options.name === "UiTab");
    },
    update() {
      this.navs = this.getChildren().map((vnode, index) => {
        if (index === 0 && !this.model) {
          this.model = vnode.name;
        }
        vnode.show = vnode.name === this.model;
        vnode.render = !this.navType;
        return {
          label: vnode.label,
          name: vnode.name || index,
          disabled: vnode.disabled,
        };
      });
    },
    updateState() {
      this.getChildren().forEach((tab) => {
        tab.show = tab.name === this.model;
      });
    },
  },
  render(c) {
    var _this = this;
    return c(
      "div",
      {
        staticClass: "ui-tab",
      },
      [
        c(
          "div",
          {
            staticClass: "ui-tab__tags",
          },
          this.navs
            .map((nav, i) =>
              c(
                "div",
                {
                  class: [
                    {
                      "ui-tab__tag": true,
                      "ui-tab__disabled": nav.disabled,
                      "ui-tab__active": !nav.disabled && this.model === nav.name,
                    },
                    this.labelClass,
                  ],
                  on: {
                    click(e) {
                      if (nav.disabled) return;
                      _this.model = _this.navs[i].name;
                      _this.$emit("change", _this.model, e);
                    },
                  },
                },
                nav.label
              )
            )
            .concat(
              this.customActive
                ? [
                    c("div", {
                      class: "ui-tab__bar",
                    }),
                  ]
                : []
            )
        ),
        c(
          "div",
          {
            staticClass: "ui-tab__views",
          },
          this.$slots.default
        ),
      ]
    );
  },
};
