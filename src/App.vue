<template>
  <tabble
    border
    highlight-row
    content-menu
    ref="selection"
    :meta="columns0"
    :data="data0"
    row-key="id"
  >
    <template slot-scope="{ row }" slot="age">
      <strong>{{ row }}</strong>
    </template>
  </tabble>
</template>

<script>
import tabble from "./table/table.vue";
export default {
  components: {
    tabble,
  },
  data() {
    return {
      columns0: [
        {
          type: 2,
          width: 60,
          align: "center",
        },
        {
          title: "Name",
          key: "name",
          tree: true,
        },
        {
          title: "Age",
          key: "age",
          sortable: true,
          filters: [
            {
              label: "Greater than 180",
              value: 1,
            },
            {
              label: "Less than 180",
              value: 2,
            },
          ],
          filters: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.age > 180;
            } else if (value === 2) {
              return row.age < 180;
            }
          },
        },
        {
          title: "Date",
          key: "date",
        },
        {
          title: "Address",
          key: "address",
          filters: [
            {
              label: "New York",
              value: "New York",
            },
            {
              label: "London",
              value: "London",
            },
            {
              label: "Sydney",
              value: "Sydney",
            },
          ],
          filterMethod(value, row) {
            return row.address.indexOf(value) > -1;
          },
        },
      ],
      data0: [
        {
          id: "100",
          name: "John Brown",
          age: 118,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
          _disabled: true,
          level: 0,
          _loading: false,
          children: [],
        },
        {
          id: "101",
          name: "Jim Green",
          age: 224,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
          _showChildren: true,
          _disabled: false,
          level: 0,
          children: [
            {
              id: "10100",
              name: "张三",
              age: 235,
              address: "发动机莲富大厦放假了开始的",
              date: "2016-10-01",
              level: 1,
            },
            {
              id: "10101",
              name: "李四",
              age: 129,
              address: "风刀霜剑分离的思路开发",
              date: "2016-10-02",
              level: 1,
            },
            {
              id: "10102",
              name: "王五",
              age: 290,
              address: "分离的付款就说个就是范德萨发生",
              date: "2016-10-03",
              _showChildren: true,
              level: 1,
              children: [
                {
                  id: "10102100",
                  name: "赵六",
                  age: 111,
                  address: "梵蒂冈人太热疼我",
                  date: "2016-10-05",
                  level: 2,
                },
                {
                  id: "10102101",
                  name: "丁八",
                  age: 272,
                  address: "法第三方的范德萨范德萨发送到",
                  date: "2016-10-06",
                  _showChildren: true,
                  level: 2,
                  children: [
                    {
                      id: "10102101100",
                      name: "第九",
                      age: 123,
                      address: "9梵蒂冈人太热疼我",
                      date: "2016-10-07",
                      _disabled: true,
                      level: 3,
                    },
                    {
                      id: "10102101101",
                      name: "第十",
                      age: 254,
                      address: "10法第三方的范德萨范德萨发送到",
                      date: "2016-10-08",
                      level: 3,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "102",
          name: "Joe Black",
          age: 130,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
          _disabled: false,
          level: 0,
          _showChildren: false,
          children: [
            {
              id: "10200",
              name: "张三3",
              age: 235,
              address: "发动机莲富大厦放假了开始的",
              date: "2016-10-01",
              level: 1,
            },
            {
              id: "10201",
              name: "张三4",
              age: 235,
              address: "发动机莲富大厦放假了开始的",
              date: "2016-10-01",
              level: 1,
            },
          ],
        },
        {
          id: "103",
          name: "Jon Snow",
          age: 126,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
          _disabled: true,
          level: 0,
        },
      ],
    };
  },
};
</script>

<style>
</style>
