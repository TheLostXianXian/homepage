<template>
  <div class="footer">
    <span class="tag">i</span>
    Designed &amp; Powerd by <a href="/">baiwei</a>
    <br />
    Copyright© 2019-2019 陈百威
    <br /><a href="http://beian.miit.gov.cn" target="_blank" rel="nofollow"
      >苏ICP备18051123号</a
    >
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {},
  created() {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  right: 2%;
  bottom: 2%;
  padding: 1.2em;
  width: 300px;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  background: rgb(9, 201, 153);
  clip-path: circle(6% at 94% 20%);
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  .tag {
    float: right;
    font-weight: bold;
    margin-right: -1.6%;
    margin-top: -3.4%;
    transition: color 0.5s;
  }
  &:hover {
    clip-path: circle(75%);
    background: #121212;
    cursor: default;
  }
  &:hover .tag {
    color: rgba(255, 255, 255, 0);
  }
}
</style>
