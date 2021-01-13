<template>
  <button
    :class="classes"
    :style="styles"
    :disabled="disabled"
    @click="handler"
    :type="nativeType"
  >
    <slot name="icon"
      ><icon v-if="icon" class="ui-button__icon" :icon="icon"></icon
    ></slot>
    <div class="ui-button__text">
      <slot>{{ label }}</slot>
    </div>
    <slot name="iconRight">
      <icon
        v-if="iconRight"
        class="ui-button__icon-right"
        :icon="iconRight"
      ></icon>
    </slot>
    <div class="ui-button__loading" v-if="iconLoding">
      <slot name="lodingIcon">
        <icon class="ui-button__loading-icon" :icon="iconLoding"></icon>
      </slot>
    </div>
  </button>
</template>

<script>
import icon from "./icon";
import { NS, simpleType } from "./utils";
var buttonNS = NS("button");

export default {
  name: "UiButton",
  components: { icon },
  props: {
    url: String,
    replace: Boolean,
    to: [String, Object],
    label: String,
    icon: String,
    iconRight: String,
    iconLoding: String,
    color: String,
    bgcolor: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    nativeType: String,
    loadingText: String,
    loadingType: String,
    tag: simpleType(String, "button"),
    type: simpleType(String, "primary"),
    size: simpleType(String, "md"),
    loadingSize: simpleType(String, "20px"),
  },
  computed: {
    classes() {
      return [
        buttonNS.b,
        buttonNS.m(
          this.disabled && "disabled",
          this.block && "block",
          this.plain && "plain",
          this.round && "round",
          this.square && "square",
          this.size,
          this.type
        ),
      ];
    },
    styles() {
      return {
        color: this.color,
        "background-color": this.bgcolor,
      };
    },
  },

  methods: {
    handler(e) {
      if (this.loading || this.disabled) return;
      if (this.url) {
        if (this.replace) return window.location.replace(this.url);
        return (window.location.href = this.url);
      }
      if (this.to) {
        if (this.$router)
          return this.$router[this.replace ? "replace" : "push"](this.to);
        throw new Error("detect $router failed,please use vue-router");
      }
      this.$emit("click", e);
    },
  },
};
</script>

<style>
</style>
