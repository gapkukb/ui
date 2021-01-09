var isImg = (function() {
  var imgPathReg = /\.(png|gif|svg|jpg|webp)$/;
  return function(s) {
    return imgPathReg.test(s);
  };
})();
function withUnit(x, unit) {
  return !x && x !== 0 ? null : Number(x) ? x + (unit || "px") : x;
}
export default {
  functional: true,
  name: "icon",
  props: {
    name: String,
    label: String,
    labelAfter: String,
    badge: [Boolean, String, Number],
    color: String,
    size: [Number, String],
    prefix: {
      type: String,
      default: "icon",
    },
    tag: {
      type: String,
      default: "i",
    },
  },
  render(c, { props, children, listeners, data }) {
    var bool = isImg(props.name),
      badge = props.badge;
    return c(
      props.tag,
      {
        class: ["ui-icon iconfont", bool ? "" : props.prefix + "-" + props.name, data.staticClass, data.class],
        style: {
          color: props.color,
          fontSize: withUnit(props.size),
        },
        on: listeners,
      },
      [
        props.label,
        bool &&
          c("img", {
            class: "ui-icon__img",
            attrs: {
              src: props.name,
            },
          }),
        badge &&
          c(
            "span",
            {
              class: ["ui-icon__badge"],
            },
            typeof badge === "boolean" ? null : badge
          ),
        props.labelAfter,
      ]
    );
  },
};
