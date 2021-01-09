import { assert, NumberLike, NS, covert2column, randomId, columns } from "../utils";
export var ns = NS("table");
export const Table = {
  props: {
    data: Array,
    metas: Array,
    stripe: Boolean,
    border: Boolean,
    showHeader: {
      type: Boolean,
      default: true,
    },
    width: NumberLike,
    height: NumberLike,
    maxHeight: NumberLike,
    loading: Boolean,
    disabledHover: Boolean,
    highlightRow: Boolean,
    rowClassName: Function,
    size: String,
    emptyText: String,
    draggable: Boolean,
    rowKey: [Boolean, String],
    spanMethod: Function,
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    indentSize: NumberLike,
    loadData: Function,
    childrenAsync: Boolean,
    contextMenu: Boolean,
    showContextMenu: Boolean,
  },
  data() {
    return {
      rules: ["all", "cols", "groups", "none", "rows"],
      colmuns: columns(this.metas),
    };
  },
  computed: {},
  methods: {
    buildSortIcon(_c) {
      return _c(
        "svg",
        {
          attrs: {
            viewBox: "0 0 20 20",
            width: "1em",
            height: "1em",
          },
        },
        [
          _c("polygon", {
            attrs: {
              points: "10 0,18 8,2 8",
            },
          }),
          _c("polygon", {
            attrs: {
              points: "2 12,18 12,10 20",
            },
          }),
        ]
      );
    },
    renderColgroup(c) {
      return c(
        "colgroup",
        {},
        this.metas.map((item) =>
          c("col", {
            attrs: {
              width: item.width,
            },
          })
        )
      );
    },
    renderHeader(c) {
      return c(
        "thead",
        {
          staticClass: ns.e("header"),
        },
        this.colmuns.map((item, index) =>
          c(
            "tr",
            item.map((sub) =>
              c(
                "th",
                {
                  staticClass: ns.e("th"),
                  attrs: {
                    colspan: sub.colspan,
                    rowspan: sub.rowspan,
                  },
                },
                sub.title
              )
            )
          )
        )
      );
    },
    renderBody(c) {
      let $cols = [];
      this.colmuns.forEach((column) => {
        $col = h("col", {
          attrs: {
            width: "auto",
          },
        });
        $cols.push($col);
      });
      // 列控制器组
      const $colgroup = h("colgroup", {}, $cols);
      let $tableTrs = [];
      this.data.forEach((row, index) => {
        let $tds = [];
        this.columns.forEach((col, subIndex) => {
          if (this.showWithSpan(row, col, rowIndex, colIndex)) {
            const $cell = h(table);
          }
        });
      });

      return c("tbody");
    },
    renderFooter(c) {
      return c("tfoot");
    },
    // 获取跨度
    getSpan(row, col, rowIndex, colIndex) {
      const fn = this.$parent.spanMethod;
      if (assert.function(fn)) {
        const result = fn({
          row,
          col,
          rowIndex,
          colIndex,
        });
        let rowspan = 1;
        let colspan = 1;

        if (assert.array(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (assert.object(result)) {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
        return {
          rowspan,
          colspan,
        };
      }
      return {};
    },
    //是否展示跨度
    showWithSpan(row, col, rowIndex, colIndex) {
      const result = this.getSpan(row, col, rowIndex, colIndex);
      const rowspan = "rowspan" in result && result.rowspan === 0;
      const colspan = "colspan" in result && result.rowspan === 0;

      return !rowspan && !colspan;
    },
  },
  mounted() {},
  render(c) {
    return c("table", { staticClass: ns.join(ns.b, ns.m("border")) }, [
      // this.renderColgroup(c),
      this.renderHeader(c),
      this.renderBody(c),
      this.renderFooter(c),
    ]);
  },
};

// title: "Name",
//           key: "name",
//           type: "index",
//           type: "selection",
//           type: "expand",
//           sortable: true,
//           filters: [],
//           filterMultiple: false,
//           treeable: true,
//           resizable: true,
//           filterMethod(value, row) {
//             return;
//           },
//           render(row, col, index) {},
//           width: 200,
