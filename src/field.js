import { Row, Column } from "./grid";
import Icon from "./icon";
import { unit, assert, prevent, NumberLike } from "./utils";

export var Field = {
  name: "field",
  components: {
    Row,
    Column,
    Icon,
  },
  props: {
    value: NumberLike,
    label: String,
    labelClass: String,
    labelWidth: String,
    labelAlign: String,
    inputStyle: Object,
    inputClass: String,
    align: String,
    size: String,
    maxlength: NumberLike,
    border: Boolean,
    colon: Boolean,
    required: Boolean,
    center: Boolean,
    clearable: Boolean,
    isLink: Boolean,
    autofocus: Boolean,
    error: Boolean,
    errorText: String,
    formatter: Function,
    autosize: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    showLimit: Boolean,
    rules: Array,
    rows: NumberLike,
    type: {
      type: String,
      default: "text",
    },
    clearBy: {
      type: String,
      default: "focus",
    },
    formatBy: {
      type: String,
      default: "change",
    },
    icon: String,
    iconRight: String,
    iconPrefix: String,
    iconLink: String,
    rules: null,
  },
  data() {
    return {
      focused: false,
      types: {
        number: "number",
        integer: "integer",
        textarea: "textarea",
        search: "search",
      },
      lineHeight: 0,
    };
  },
  computed: {
    listeners() {
      return Object.assign({}, this.$listeners, {
        input: this.input,
        focus: this._focus,
        blur: this._blur,
        click: this.emit("click"),
      });
    },
    _type() {
      var t = this.types;
      var tag = this.type === t.textarea ? t.textarea : "input";
      var type = this.type;
      var mode = type;
      if (this.type === t.number) {
        type = "text";
        mode = "decimal";
      } else if (type === t.integer) {
        type = "tel";
        mode = "numeric";
      }
      return { tag, mode, type };
    },
    _autosize() {
      return this.type === this.types.textarea && this.autosize;
    },
  },
  methods: {
    //@exposed api
    focus: function() {
      this.$refs.input.focus();
    },
    //@exposed api
    blur: function() {
      this.$refs.input.blur();
    },
    update(value, by = "change") {
      value = assert.def(value) ? String(value) : "";
      var max = this.maxlength;
      // pipe to slice by max length limit
      if (assert.def(max) && value.length > max) {
        if (this.value && this.value.length === +max) {
          value = this.value;
        } else {
          value = value.slice(0, max);
        }
      }
      if (this.type === this.types.number || this.type === this.types.integer) {
        var int = this.type === this.types.number;
        value = this.formatNumber(value, int, int);
      }

      if (this.formatter && by === this.formatBy) value = this.formatter(value);
      var input = this.$refs.input;
      if (input && value !== input.value) input.value = value;
      if (value !== this.value) this.$emit("input", value);
    },
    trim(value, char, reg) {
      var i = value.indexOf(char);
      if (i === -1) return value;
      if (char === "-" && i !== 0) return value.slice(0, i);
      return value.slice(0, i + 1) + value.slice(i).replace(reg, "");
    },
    formatNumber(value, dot = true, minus = true) {
      if (dot) value = this.trim(value, ".", /\./g);
      else value = value.split(".")[0];
      if (minus) value = this.trim(value, "-", /-/g);
      else value = value.replace(/-/, "");
      return value.replace(dot ? /[^-0-9.]/g : /[^-0-9]/g, "");
    },
    adjust() {
      if (!this._autosize) return;
      this.$refs.input.style.height = "auto";
      var min = this.$refs.input.scrollHeight;
      if (this.rows) {
        min = Math.min(min, this.lineHeight * this.rows);
      }
      this.$refs.input.style.height = min + "px";
    },
    input(e) {
      if (e.target.composing) return;
      this.adjust();
      this.update(e.target.value);
    },
    _focus(e) {
      this.focused = true;
      this.$emit("focus", e);
      if (this.readonly) this.blur();
    },
    _blur(e) {
      this.focused = false;
      this.update(this.value, "blur");
      this.$emit("blur", e);
      // this.validateByTrigger("blur");
      // this.resetScroll();
    },
    clear(e) {
      prevent(e);
      this.$emit("input", "");
      this.$emit("clear", e);
      this.adjust();
    },
    emit(ename) {
      return function(e) {
        this.$emit(ename, e);
      }.bind(this);
    },
    createInput(c) {
      return (
        this.$slots.input ||
        c(this._type.tag, {
          ref: "input",
          staticClass: "ui-field__value",
          class: Object.assign(
            {
              "ui-field__overlap": this._autosize,
              "ui--pretty-bar": this.type === this.types.textarea,
            },
            this.inputClass
          ),
          style: this.inputStyle,
          domProps: {
            value: this.value,
          },
          attrs: Object.assign({}, this.$attrs, {
            readonly: this.readonly,
            disabled: this.disabled,
            rows: this._autosize ? 1 : this.rows,
            type: this._type.type,
            inputmode: this._type.mode,
          }),
          directives: [
            {
              name: "model",
              value: this.value,
            },
          ],
          on: this.listeners,
        })
      );
    },

    createClearIcon(c) {
      var slot = this.$slots["icon-clear"];
      return (
        (slot || this.clearable) &&
        c(
          "div",
          {
            staticClass: "ui-field__clear",
            directives: [
              {
                name: "show",
                value: this.value && !this.readonly && !this.disabled,
              },
            ],
            on: {
              click: this.clear,
            },
          },
          slot || [
            c("icon", {
              staticClass: "ui-field__icon-right",
              attrs: {
                name: "jilu",
                prefix: this.iconPrefix,
              },
            }),
          ]
        )
      );
    },
    createRightIcon(c) {
      var slot = this.$slots["icon-right"];
      return (
        (slot || this.iconRight) &&
        c(
          "div",
          {
            staticClass: "ui-field__icon-right",
            on: {
              click: this.emit("click-icon-right"),
            },
          },
          slot || [
            c("icon", {
              attrs: {
                name: this.iconRight,
                prefix: this.iconPrefix,
              },
            }),
          ]
        )
      );
    },
    createLinkIcon(c) {
      var slot = this.$slots["icon-link"];
      var flag = (slot || this.iconLink) && this.isLink;
      return (
        flag &&
        c(
          "div",
          {
            staticClass: "ui-field__icon-link",
            on: {
              click: this.emit("click-icon-link"),
            },
          },
          slot || [
            c("icon", {
              attrs: {
                name: this.iconLink,
                prefix: this.iconPrefix,
              },
            }),
          ]
        )
      );
    },
    createLabel(c) {
      var labelClass = {
        "ui-field__label": true,
        "ui-filed__disabled": this.disabled,
      };
      labelClass["ui-field__label--" + this.labelAlign] = !!this.labelAlign;
      labelClass[this.labelClass] = !!this.labelClass;
      return (
        this.label &&
        c(
          "div",
          {
            class: labelClass,
            style: {
              width: unit(this.labelWidth),
            },
          },
          this.$slots.label || [
            c("span", {
              domProps: {
                innerHTML: this.label,
              },
            }),
          ]
        )
      );
    },
    createIcon(c) {
      return (
        (this.$slots.icon || this.icon) &&
        c(
          "div",
          {
            staticClass: "ui-field__icon",
          },
          this.$slots.icon || [c("icon", { attrs: { name: this.icon, prefix: this.iconPrefix } })]
        )
      );
    },
    createLimit(c) {
      return (
        this.showLimit &&
        this.maxlength &&
        c(
          "div",
          {
            staticClass: "ui-field__limit",
          },
          [c("span", { class: "ui-field__word" }, this.value.length), "/", this.maxlength]
        )
      );
    },
    createMessage(c) {
      return (
        this.errorText &&
        this.error &&
        c(
          "div",
          {
            staticClass: "ui-field__error",
          },
          this.errorText
        )
      );
    },
  },
  mounted() {
    this.lineHeight = parseInt(getComputedStyle(this.$refs.input).lineHeight);
    this.update(this.value, this.formatBy);
  },
  render(c) {
    var boxClass = {
      "ui-field": true,
      "ui-field--required": this.required,
      "ui-field--error": this.error && !this.errorText,
      "ui-field--top": !this.center,
    };
    boxClass["ui-field--" + this.align] = !!this.align;
    boxClass["ui-field--" + this.size] = !!this.size;
    return c(
      "div",
      {
        class: boxClass,
      },
      [
        this.createIcon(c),
        this.createLabel(c),
        this.colon && c("span", {}, ":"),
        c(
          "div",
          {
            staticClass: "ui-field__main",
          },
          [
            //body module
            c(
              "div",
              {
                staticClass: "ui-field__body",
              },
              [
                ,
                this.createInput(c),
                this.createClearIcon(c),
                this.createRightIcon(c),
                this.$slots.button && c("div", { staticClass: "ui-field__button" }, [this.$slots.button]),
                //link
                this.createLinkIcon(c),
              ]
            ),
            this.createLimit(c),
            this.createMessage(c),
          ]
        ),
      ]
    );
  },
};
