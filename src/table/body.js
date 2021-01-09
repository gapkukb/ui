export default {
  name: "TableBody",
  components: {
    cell,
    expand,
    trow,
  },
  props: {
    prefix: String,
    style: Object,
    cols: Array,
    data: Array, // rebuid data
    oData: Object,
    width: Object,
    fixed: [Boolean, String],
    draggable: Boolean,
    rowKey: Boolean,
  },
  computed: {
    renderExpand() {
      let l = this.cols.length;
      for (let i = 0; i < l; i++) {
        const cur = this.cols[i];
        if (cur.type === "expand" && cur.render) {
        }
      }
    },
  },
};
