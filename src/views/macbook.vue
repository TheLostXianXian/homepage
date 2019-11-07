<template>
  <div class="macbook-pro-container">
    <div class="device device-macbook-pro">
      <div class="device-frame">
        <div class="device-content">
          <div class="device-window-bar">
            <span class="close"></span>
            <span class="minimal"></span>
            <span class="maximal"></span>
          </div>
          <slot></slot>
        </div>
      </div>
      <div class="device-stripe"></div>
      <div class="device-header"></div>
      <div class="device-sensors"></div>
      <div class="device-btns"></div>
      <div class="device-power"></div>
    </div>
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
.macbook-pro-container {
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-items: center;
  align-items: center;
}

.device-window-bar {
  position: relative;
}

.device-window-bar .close {
  position: absolute;
  top: 4px;
  left: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: red;
}

.device-window-bar .close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -2px;
  margin-left: -2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000;
}

.device-window-bar .minimal {
  position: absolute;
  top: 4px;
  left: 26px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #feb53c;
}

.device-window-bar .maximal {
  position: absolute;
  top: 4px;
  left: 44px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2ac145;
}
</style>
