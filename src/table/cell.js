import { ns } from ".";
import { assert, unit } from "../utils";

export default {
  name: "table-cell",
  inject: ["root", "context", "tr"],
  props: {
    prefix: String,
    row: Object,
    col: Object,
    natrualIndex: Number, // index of rebuid data
    index: Number, //index of data
    checked: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    fixed: {
      type: [Boolean, String],
      default: false,
    },
    treeNode: Boolean,
    treeDepth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      renderType: "",
      uid: -1,
      showToolTip: false,
      types: ["html", "normal", "render", "slot"],
    };
  },
  computed: {
    rtype() {
      return this.types.indexOf(this.renderType) !== -1;
    },
    classes() {
      var t = this.renderType;
      var x = "expand";
      var y = "selection";
      const c = ns.e(t === x && x, t === y && y, this.col.ellipsis && "ellipsis");
      return [ns.e("cell"), c];
    },
    expandedClass() {
      return [ns.e("expand", this.expanded && "opend")];
    },
    showChildren() {
      return this.rtype && (!assert.empty(this.row.children) || "__loading" in this.row) && "tree" in this.tree;
    },
    showTreeNode() {
      return this.rtype && this.col.tree && this.treeNode;
    },
    showLevel() {
      return this.showTreeNode;
    },
    treeLevelStyle() {
      return {
        "padding-left": this.treeLevel * unit(this.root.indentSize),
      };
    },
    childrenExpand() {
      return this.root.getDataByRowKey(this.row.__rowKey).__isShowChildren;
    },
    childrenLoding() {
      let data = this.root.getDataByRowKey(this.row.__rowKey).__loading;
      return "__loading" in data && data.__loading;
    },
  },
  methods: {
    toggleSelected() {
      this.root.toggleSelected(this.index, this.treeNode ? this.row.__rowKey : null);
    },
    toggleExpand() {
      this.root.toggleExpand(this.index);
    },
    handleTipIn() {
      const $el = this.$refs.content;
      this.showToolTip = $el.scrollWidth > $el.offsetWidth;
    },
    handleTipOut() {
      this.showToolTip = false;
    },
    handleTipShow() {
      this.showToolTip = true;
    },
    handleTipHide() {
      this.showToolTip = false;
    },
    handleToggleTree() {
      this.root.toggleTree(this.row.__rowKey);
    },
    handleClick(e) {
      this.root.$emit("cell-click", this.row, this.col, this.row[this.col.key], e);
    },
  },
  created() {
    let type = this.col.type;
    if (type === "index" || type === "selection" || type === "html" || type === "expand") {
      this.renderType === type;
    } else if (this.col.render) {
      this.renderType = "render";
    } else if (this.col.slot) {
      this.renderType = "slot";
    } else {
      this.renderType = "normal";
    }
  },
};
