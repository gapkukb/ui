<template>
  <label :class="classes" @click="handle">
    <slot name="icon"><icon :icon="_icon"></icon></slot>
    <span :class="textclass"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
<script>
import icon from "./icon";
import { simpleType, complexType, NS } from "./utils";
var ns = NS("label");
export default {
  name: "UiLabel",
  components: {
    icon,
  },
  props: {
    label: null,
    disabled: Boolean,
    readonly: Boolean,
    round: Boolean,
    reverse: Boolean,
    indet: Boolean,
    name: String,
    size: String,
    type: String, // button
    value: simpleType([String, Number, Boolean], false),
    icon: simpleType(String, "emoji1"),
    iconActive: simpleType(String, "jilu"),
    iconIndet: String,
  },
  data() {
    return {
      index: 0,
      inGroup: false,
      checked: this.value,
      parent: null,
      focused: false,
    };
  },
  watch: {
    value() {
      this.checked = this.value;
    },
  },
  computed: {
    _icon() {
      return this.indet
        ? this.iconIndet
        : this.checked
        ? this.iconActive
        : this.icon;
    },
    classes() {
      return [
        ns.b,
        ns.m(
          this.checked && "checked",
          this.disabled && "disabled",
          this.readonly && "readonly"
        ),
      ];
    },
    textclass() {
      return [ns.e("text", this.reverse && "reverse")];
    },
    _value() {
      return this.value || this.label;
    },
  },
  methods: {
    handle(e) {
      // todo:  indeterminate 中间态-部分选中
      if (this.disabled || this.readonly) return;
      var ret = (this.checked = !this.checked);
      this.$emit("input", ret);

      if (this.inGroup) {
        this.parent && this.parent.change(this.index, ret ? this._value : null);
      } else {
        this.$emit("change");
      }
    },
  },
  created() {
    if (this.$parent.$options.name === "group") {
      this.parent = this.$parent;
      this.inGroup = true;
    }
  },
};
</script>
