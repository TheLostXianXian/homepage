<template>
  <div class="history">
    <command-line v-for="(item, index) in history" :key="index">
      <template v-slot:prefix>
        <span class="prefix">{{
          `[${userName}@${machineName} ${item.pathName}]# `
        }}</span>
      </template>
      <template v-slot:command>
        <span class="command">{{ item.command }}</span>
      </template>
      <template v-slot:result>
        <div v-html="item.result"></div>
      </template>
    </command-line>
  </div>
</template>

<script>
import CommandLine from "./command-line"
// 由两部分组成， 指令和执行结果。
export default {
  data() {
    return {
      userName: "baiwei",
      machineName: "xlxlx.xyz"
    }
  },
  props: {
    history: {
      type: Array,
      default: function() {
        return []
      }
    },
    prefix: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CommandLine
  },
  created() {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
