<template>
  <div id="app">
    <!-- <Pager v-model="page1" :total="300" :size="5" />{{ page1 }}
    <Pager v-model="page2" :total="300" :size="10" />
    <Pager v-model="page3" :total="300" :size="10" :formater="formater">
      <template #prev>123</template>
    </Pager>
    <Pager v-model="page4" :total="50" :size="10" :sizeOption="[1, 2, 3, 4]" jumper /> -->
    <!-- <dropdown
      ref="drop"
      mutiple
      v-model="arr"
      :data="dropdown"
      @click="click"
      icon="jilu"
      right-icon
      :auto-close="false"
      style="margin-left:300px"
    >
    </dropdown>
    {{ arr }}
    <div style="width:300px;height:300px"></div>
    <dropdown :data="dropdown" style="margin-left:300px"></dropdown> -->
    <!-- <imager round fit="contain" width="100" height="100" src="https://file.iviewui.com/asd/asd-pro-3.png"></imager>
    <imager round fit="fill" width="100" height="100" src="https://file.iviewui.com/asd/asd-pro-3.png"></imager>
    <imager round fit="cover" width="100" height="100" src="https://file.iviewui.com/asd/asd-pro-3.png"></imager>
    <imager
      round
      :error="true"
      fit="none"
      width="100"
      height="100"
      src="https://file.iviewui.com/asd/asd-pro-3.png"
    ></imager>
    <imager
      round
      :loading="true"
      radius="10"
      width="100"
      height="100"
      src="https://file.iviewui.com/asd/asd-pro-3.png"
    ></imager> -->
    <!-- <slider :height="300" :width="500">
      <slider-item v-for="item in arr" tag="a" href="/abc"
        ><img src="https://file.iviewui.com/asd/asd-pro-3.png" alt=""
      /></slider-item>
    </slider> -->
    <!-- <row gap="xs,sm=sm,md=md,lg=lg,xl=xl" inline-gap="10" justify="center">
      <column span="md=8,lg=6" order="1" at="core">456</column>
    </row> -->
    <!-- <row :gap="{ xl: 'sm', 'sm-x': 'md' }" align="top" justify="left" nowrap>
      <column>123</column>
      <column>456</column>
      <column>789</column>
    </row>
    <row gap="xl" align="bottom" justify="right" nowrap>
      <column>123</column>
      <column>456</column>
      <column>789</column>
    </row>
    <row gap="10" align="center" justify="around" nowrap>
      <column>123</column>
      <column>456</column>
      <column>789</column>
    </row>
    <row gap="10" align="center" justify="between" multiple="" nowrap>
      <column>123</column>
      <column>456</column>
      <column>789</column>
    </row> -->
    <!-- <field
      :formatter="formatter"
      format-by="blur"
      colon
      label="小数"
      v-model="page4"
      type="number"
      maxlength="16"
      rows="4"
    >
    </field> -->
    <!-- <field type="number"></field>
    <field type="digit"></field>
    <field v-model.trim="page4"></field> -->

    <i-table :metas="cols" :data="data"></i-table>
  </div>
</template>
<script>
import Vue from "vue";
import Pager from "./pager";
import { Dropdown } from "./dropdown";
import Slider, { SliderItem } from "./carousel";
import { Row, Column } from "./grid";
import { Field } from "./field";
import { Table } from "./table";
import icon from "./icon";

export default {
  components: {
    Pager,
    Dropdown,
    Slider,
    SliderItem,
    Row,
    Column,
    Field,
    icon,
    iTable: Table,
  },
  data() {
    return {
      cols: [
        {
          title: "Name",
          key: "name",
          align: "center",
          width: 200,
          fixed: "left",
          filters: [
            {
              label: "Joe",
              value: 1,
            },
            {
              label: "John",
              value: 2,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.name === "Joe";
            } else if (value === 2) {
              return row.name === "John Brown";
            }
          },
        },
        {
          title: "Other",
          align: "center",
          children: [
            {
              title: "Age",
              key: "age",
              align: "center",
              width: 200,
              sortable: true,
            },
            {
              title: "Address",
              align: "center",
              children: [
                {
                  title: "Street",
                  key: "street",
                  align: "center",
                  width: 200,
                },
                {
                  title: "Block",
                  align: "center",
                  children: [
                    {
                      title: "Building",
                      key: "building",
                      align: "center",
                      width: 200,
                      sortable: true,
                    },
                    {
                      title: "Door No.",
                      key: "door",
                      align: "center",
                      width: 200,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Company",
          align: "center",
          children: [
            {
              title: "Company Address",
              key: "caddress",
              align: "center",
              width: 200,
            },
            {
              title: "Company Name",
              key: "cname",
              align: "center",
              width: 200,
            },
          ],
        },
        {
          title: "Gender",
          key: "gender",
          align: "center",
          width: 200,
          fixed: "right",
        },
      ],
      data: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
          __active: true,
          __checked: true,
          __disabled: true,
          __expanded: true,
          __disabledExpand: true,
          __children: [],
          __activeChildren: true,
          __loading: true, //异步加载子项，配合load-children函数
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
        },
      ],
    };
  },
  methods: {
    formatter(value) {
      console.log(value);
      return value * 1000;
    },
    keypress() {
      console.log(this.page1);
    },
    click(e) {
      alert(e);
    },
  },
  mounted() {
    setTimeout(() => {
      this.arr = [1, 23, 4, 6, 7];
      this.count = 10;
      setTimeout(() => {
        this.arr = [1];
        setTimeout(() => {
          this.arr = [1, 2, 3];
          setTimeout(() => {
            this.arr = [];
          }, 1000);
        }, 1000);
      }, 1000);
      // this.$refs.drop.toggle();
      // this.dropdown = [1, 2, 3, 3, 45, 5, 6123];
    }, 3000);
  },
};
</script>
<style lang="stylus">
.ui-pager__active
  background-color red
.ui-pager__disabled
  background-color #000000
  color #fff
</style>
