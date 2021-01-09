export const Marquee = {
  render(c) {
    return c("marquee", { staticClass: "ui-marquee" }, this.$slots.default);
  },
};
