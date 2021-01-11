<template>
  <div class="ui-table-outer">
    <table :class="_tableclass" :rules="_border.rules" :frame="_border.frame">
      <colgroup>
        <col
          v-for="(col, index) in cols"
          :key="index"
          :width="col.width || null"
        />
      </colgroup>
      <thead>
        <tr v-for="(cols, rindex) in rows" :key="rindex">
          <th
            v-for="(col, cindex) in cols"
            :key="cindex"
            :colspan="col.colspan"
            :rowspan="col.rowspan"
            :class="headerclass(col)"
          >
            <!-- 有扩展项 -->
            <template v-if="col.type === rtype.EXPAND">
              <render-header
                v-if="col.renderHeader"
                :render="col.renderHeader"
                :col="col"
                :index="cindex"
              ></render-header>
              <template v-else>{{ col.title }} </template>
            </template>
            <!-- 选择项 -->
            <template v-else-if="col.type === rtype.SELECTION">
              <input type="checkbox" />
            </template>
            <template v-else>
              <render-header
                v-if="col.renderHeader"
                :col="col"
                :render="col.renderHeader"
                :index="cindex"
              ></render-header>
              <template v-else>{{ col.title || "#" }} </template>
              <svg viewbox="0 0 90 180" height="1em" v-if="col.sortable">
                <polygon
                  class="ui-table__asc"
                  points="0,75 45,30 90,75"
                  @click="sortAction(rindex)"
                />
                <polygon
                  class="ui-table__desc"
                  points="0,105 45,150, 90 105"
                  @click="sortAction(rindex)"
                />
              </svg>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rindex) in rebuildData"
          :key="rowKey ? row._rowKey : rindex"
          :class="_rowclass"
          :draggable="draggable"
          @click="$emit('row-click', $event)"
        >
          <td
            v-for="(col, cindex) in cols"
            :key="cindex"
            :class="cellclass(col)"
          >
            <template v-if="col.type === rtype.INDEX">
              {{ col.indexMethod ? col.indexMethod(row) : rindex }}
            </template>
            <input v-else-if="col.type === rtype.SELECTION" type="checkbox" />
            <template v-else-if="col.type === rtype.HTML">
              <span v-html="row[col.key]"></span>
            </template>

            <template v-else-if="col.type === rtype.EXPAND">
              <icon icon="jilu"></icon>
            </template>
            <render-expand
              v-else-if="col.render"
              :row="row"
              :col="col"
              :index="row._index"
              :render="col.render"
            ></render-expand>
            <render-cell
              v-else-if="col.slot"
              :row="row"
              :col="col"
              :index="row._index"
              :display="col.display || 'block'"
            ></render-cell>
            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  NS,
  complexType,
  assert,
  deepclone,
  randomId,
  columns,
  CONST,
  simpleType,
  NumberLike,
  flatTree,
  unit,
} from "./utils";
// import UiTbody from "./body";
var rowKey = 1;
var colKey = 1;
var ns = NS("table");
export default {
  name: "UiTable",
  provide() {
    return {
      table: this,
    };
  },
  components: {
    renderHeader: {
      functional: true,
      props: {
        render: Function,
        column: Object,
        index: Number,
      },
      render: (h, ctx) => {
        const params = {
          column: ctx.props.column,
          index: ctx.props.index,
        };
        return ctx.props.render(h, params);
      },
    },
    renderCell: {
      functional: true,
      inject: ["table"],
      props: {
        row: Object,
        col: simpleType(Object, null),
        index: Number,
        display: simpleType(String, "block"),
      },
      render: (c, ctx) => {
        var props = ctx.props;
        let scopeslot = ctx.injections.table.$scopedSlots[props.col.slot]({
          row: props.row,
          col: props.col,
          index: props.index,
        });
        return c("div", {}, scopeslot);
      },
    },
    renderExpand: {
      functional: true,
      props: {
        row: Object,
        col: simpleType(Object, null),
        index: Number,
        render: Function,
      },
      render: (c, ctx) => {
        var props = ctx.props;
        var params = {
          row: props.row,
          index: props.index,
          col: props.col || null,
        };
        return props.render(c, params);
      },
    },
  },
  props: {
    data: complexType(Array),
    meta: complexType(Array),
    size: String,
    align: String,
    width: [Number, String],
    height: [Number, String],
    maxHeight: [Number, String],
    stripe: Boolean,
    border: {
      type: String,
      default: "rows", //all frame rows purerows cols purecols groups none
    },
    draggable: Boolean,
    unhover: Boolean,
    headerless: Boolean,
    highlight: Boolean,
    fixedWidth: Boolean,
    rowclass: Function,
    context: Object,
    rowKey: simpleType([Boolean, String], false),
    spanMethod: Function,
    summaryMethod: Function,
    sumText: String,
    indent: NumberLike,
    contextMenu: Boolean,
  },
  data() {
    var meta = this.setId(this.meta);
    return {
      rtype: CONST.RENDER_TYPE,
      rows: this.setRows(meta),
      cols: this.setCols(meta),
      rebuildData: [],
    };
  },
  watch: {
    data() {
      this.rebuilder();
    },
  },
  computed: {
    _border() {
      return {
        frame: CONST.TABLE_FRAME[this.border] || "box",
        rules: this.border.replace("pure", ""),
      };
    },
    _tableclass() {
      return [
        ns.b,
        ns.m(
          this.stripe && "stripe",
          this.unhover ? "" : "hover",
          this.size,
          this.fixedWidth && "fixed"
        ),
        ns.e(this.align),
      ];
    },
    _rowclass() {},
  },
  methods: {
    headerclass(col) {
      return ns.e(col.align);
    },
    cellclass(col) {
      return ns.e(col.align);
    },
    haschildren(o) {
      return o && o.children && o.children.length;
    },
    setWidth(col) {
      if (col.width) return unit(col.width);
      return "";
    },
    class(col, row) {},
    setId(meta) {
      return meta.map((item) => {
        if (item.children) this.setId(item.children);
        item.__id = randomId();
        return item;
      });
    },
    setGrid(cols) {},
    flatTree(cols, flag) {
      // 将树结构进行平铺
      const result = [];
      cols.forEach((column) => {
        if (column.children) {
          flag && result.push(column);
          result.push.apply(result, this.flatTree(column.children, flag));
        } else {
          result.push(column);
        }
      });
      return result;
    },
    setCols(meta) {
      let d = deepclone(this.flatTree(meta)).map((col, index) => {
        col._index = index;
        col._colKey = colKey++;
        col.width = parseInt(col.width);
        col._width = col.width || "";
        col._sortType = col.sortType || CONST.RENDER_TYPE.NORMAL;
        col._filterVisible = false;
        col._filters = col.filters || true;
        col._isFiltered = col.filteredValue ? true : false;
        col._filterChecked = col.filteredValue || [];

        return col;
      });
      console.log(d);
      return d;
    },
    setRows(cols) {
      let maxLevel = 1;
      function traverse(col, parent) {
        if (parent) {
          // 如果存在父级，则当前项的层级等于父层级+1，并更新最大层级变量
          var l = (col.level = parent.level + 1);
          if (maxLevel < l) maxLevel = l;
        }
        //设置跨列
        if (col.children) {
          let colspan = 0;
          col.children.forEach((sub) => {
            // 归的时候逐层将父级colspan累加上子项的colspan
            traverse(sub, col);
            colspan += sub.colspan;
          });
          col.colspan = colspan;
        } else {
          // 如果不存在子项,则不需要进行跨列，将colspan设为1
          col.colspan = 1;
        }
      }
      cols.forEach((col) => {
        col.level = 1;
        traverse(col);
      });
      // 初始化行数，总行数等于树深度
      const rows = new Array(maxLevel).fill(0).map(() => Array());
      // 平铺树结构
      this.flatTree(cols, true).forEach((col) => {
        // 跨行数 = 最大深度减去当前深度
        if (!col.children) col.rowspan = maxLevel - col.level + 1;
        else col.rowspan = 1;
        rows[col.level - 1].push(col);
      });
      return rows;
    },
    setSort(data, type, index) {
      var col = this.cols[index];
      var k = col.key;
      var cur;
      data.sort(function (a, b) {
        if (col.sortMethod) return col.sortMethod(a[k], b[k], type);
        if (type === "asc") return a[k] > b[k];
        if (type === "desc") return a[k] < b[k];
      });
      var i = data.length;
      while (i--) {
        cur = data[i];
        if (this.haschildren(cur)) {
          cur.children = this.setSort(cur.children, type, index);
        }
      }
    },
    setFilter(data, col) {
      return data.filter((row) => {
        if (assert.function(col.filterRemote)) return true;
        var i = col._filterChecked.length;
        var status = !i;
        while (i--) {
          status = col.filterMethod(col._filterChecked[i], row);
          if (status) break;
        }
        return status;
      });
    },
    makeData(data) {
      return data.map((row, index) => {
        row._index = index;
        row._rowKey = assert.string(this.rowKey) ? row[this.rowKey] : rowKey++;
        if (this.haschildren(row)) {
          row.children = this.makeData(row.children);
        }
        return row;
      });
    },
    makeDataWithSort() {
      var data = this.makeData(deepclone(this.data));
      var normal = CONST.RENDER_TYPE.NORMAL;
      var sortType = normal;
      var sortIndex = -1;
      var customable = false;
      var i = this.cols.length;
      var cur;
      while (i--) {
        cur = this.cols[i];
        if (cur._sortType !== normal) {
          sortType = cur._sortType;
          sortIndex = i;
          customable = cur.sortable === "custom";
          break;
        }
      }
      if (sortType !== normal && !customable) {
        data = this.setSort(data, sortType, sortIndex);
      }
      return data;
    },
    makeDataWithSortAndFilter() {
      var data = this.makeDataWithSort();
      this.cols.forEach((col) => {
        data = this.setFilter(data, col);
      });
      return data;
    },
  },
  created() {
    this.rebuildData = this.makeDataWithSortAndFilter();
    console.log(this.rebuildData);
  },
};
</script>
