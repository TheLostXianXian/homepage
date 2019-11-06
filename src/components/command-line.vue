<template>
  <div>
    <div class="command-line">
      <!-- 前缀是可以不要的,用来做交互模式 -->
      <slot name="prefix"></slot>
      <slot name="command"></slot>
    </div>
    <slot name="result"></slot>
  </div>
</template>

<script>
export default {
  props: {
    command: {
      type: String,
      default: ""
    },
    result: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      message: ""
    }
  },
  components: {},
  created() {},
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">
.command-prefix {
}
</style>
