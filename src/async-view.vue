<template>
  <div class="ui-view">
    <div class="ui-view__main" v-if="valid">
      <slot></slot>
    </div>
    <div class="ui-view__exception" v-else @click="report">
      <icon :icon="exception.icon" :size="100"></icon>
      <div class="ui-view__text">{{ exception.text }}</div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import icon from "./icon";
import { NS, simpleType } from "./utils";
var ns = NS("view");
var ASYNC = {
  NONE: -1,
  LOADING: 0,
  SUCCESS: 1,
  NO_DATA: 2,
  NETWORK_ERR: 3,
  SERVER_ERR: 4,
  COMMON_ERR: 5,
};
export default {
  name: "AsyncView",
  components: {
    icon,
  },
  props: {
    state: simpleType(Number, ASYNC.NONE),
    loadingIcon: simpleType(String, "jilu"),
    loadintText: simpleType(String, "loading"),
    emptyIcon: simpleType(String, "jilu"),
    emptyText: simpleType(String, "sorry,not found"),
    networkIcon: simpleType(String, "jilu"),
    networkText: simpleType(String, "bad network!"),
    serverIcon: simpleType(String, "jilu"),
    serverText: simpleType(String, "server error,please try agian later!"),
    commonIcon: simpleType(String, "jilu"),
    commonText: simpleType(String, "common message"),
  },
  computed: {
    valid() {
      return this.state === ASYNC.SUCCESS;
    },
    exception() {
      var icon = "",
        text = "";
      switch (this.state) {
        case ASYNC.LOADING:
          icon = this.loadingIcon;
          text = this.loadintText;

        case ASYNC.NO_DATA:
          icon = this.emptyIcon;
          text = this.emptyText;

        case ASYNC.NETWORK_ERR:
          icon = this.networkIcon;
          text = this.networkText;

        case ASYNC.SERVER_ERR:
          icon = this.serverIcon;
          text = this.serverText;

        case ASYNC.COMMON_ERR:
          icon = this.commonIcon;
          text = this.commonText;
      }
      return { icon: icon, text: text };
    },
    classes() {
      return [ns.b];
    },
  },
  methods: {
    report() {
      if (this.state < ASYNC.NETWORK_ERR) return;
      this.$emit("error", this.state);
    },
  },
};
</script>

<style>
</style>
