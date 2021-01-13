<template>
  <div>
    <tabs @change="click" label-class="abc" value-class="efg">
      <tab
        v-for="item in arr"
        :label="'标签' + item"
        :name="item"
        :disabled="item === 4"
        class="1333333333"
        >标签一的内容{{ item }}</tab
      >
    </tabs>
  </div>
</template>
<script>
import { DropdownItem, Dropdown } from "./dropdown";
import Slider, { SliderItem } from "./slider";
import { Tabs, Tab } from "./tabs";
export default {
  components: { DropdownItem, Dropdown, Slider, SliderItem, Tabs, Tab },
  data() {
    return {
      model: "1",
      arr: [1, 2, 3, 4],
    };
  },
  methods: {
    click(n, e) {
      console.log(123, e);
    },
  },
  mounted() {
    setTimeout(() => {
      this.model = ["3", "2"];
      // this.arr = [1];
    }, 2000);
  },
};
</script>
