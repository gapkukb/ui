import { unit, isImg, NS } from "./utils";
var ns = NS("icon");
export default {
  functional: true,
  name: "icon",
  props: {
    icon: String,
    badge: [Boolean, String, Number],
    color: String,
    size: [Number, String],
    iconName: {
      type: String,
      default: "iconfont",
    },
    iconPrefix: {
      type: String,
      default: "icon-",
    },
    tag: {
      type: String,
      default: "i",
    },
  },
  render(c, ctx) {
    var data = ctx.data;
    var props = ctx.props;
    var icon = props.icon;
    var bool = isImg(icon);
    var badge = props.badge;
    return c(
      props.tag,
      {
        class: [ns.b, props.iconName, bool ? "" : props.iconPrefix + icon, data.staticClass, data.class],
        style: {
          color: props.color,
          fontSize: unit(props.size),
        },
        on: ctx.listeners,
      },
      [
        bool &&
          c("img", {
            class: ns.e("img"),
            attrs: {
              src: icon,
            },
          }),
        badge &&
          c(
            "span",
            {
              class: ns.e("badge"),
            },
            typeof badge === "boolean" ? null : badge
          ),
      ]
    );
  },
};
