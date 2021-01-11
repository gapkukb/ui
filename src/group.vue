<template>
  <div :class="classes"><slot></slot></div>
</template>
<script>
import icon from "./icon";
import { assert, complexType, NS, simpleType } from "./utils";
var ns = NS("lgroup");
export default {
  name: "group",
  props: {
    disabled: Boolean,
    readonly: Boolean,
    horizontal: Boolean,
    type: String,
    icon: {
      type: String,
      default: "emoji1",
    },
    iconActive: {
      type: String,
      default: "emoji2",
    },
    value: complexType([Array, Boolean], []),
    radioValue: simpleType([]),
  },
  data() {
    return {
      model: this.value,
    };
  },
  watch: {
    value(val) {
      this.update(val);
    },
  },
  computed: {
    classes() {
      return [ns.b, ns.m(this.horizontal ? "row" : "col")];
    },
  },
  methods: {
    dispatch(model) {
      this.$emit("input", model);
      this.$emit("change", model);
    },
    change(index, data) {
      if (this.type === "radio") {
        this.model = data;
      } else {
        this.model[index] = data;
        let model = this.model.filter((i) => assert.def(i));
        this.dispatch(model);
      }
    },
    toggle(type) {
      if (this.type === "radio") return;
      //type：true 全选 false全不选 undefined 反选
      var b = assert.boolean(type);
      this.model = this.$children.map((child, index) => {
        child.checked = b ? type : !child.checked;
        return child.checked ? child._value : null;
      });
      this.dispatch(this.model.filter((i) => assert.def(i)));
    },
    update() {
      this.model = this.$children.map((child, index) => {
        child.index = index;
        child.checked = this.value.indexOf(child._value) !== -1;
        return child.checked ? child._value : null;
      });
    },
  },
  mounted() {
    this.update();
  },
};
</script>
