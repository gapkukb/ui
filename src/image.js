import icon from "./icon";

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
    fluent: Boolean,
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
    <div class="ui-image" :class="{'ui-image--round':round,'ui-image--fluent':fluent}" :style="{'border-radius':withUnit(radius),width:withUnit(width),height:withUnit(height)}">
      <slot v-if="error" name="error"><icon class="ui-image__error" :name="errorIcon"/></slot>
      <slot v-else-if="loading" name="loading"><icon class="ui-image__loading" :name="loadingIcon"/></slot>
      <slot v-else><img class="ui-image__img" :src="src" :style="{'object-fit':fit}"/></slot>


    </div>
  `,
};
