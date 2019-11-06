<template>
  <div id="app">
    <Macbook>
      <Homepage />
    </Macbook>
  </div>
</template>

<script>
import Homepage from "./views/homepage"
import Macbook from "./views/macbook"
export default {
  name: "app",
  components: {
    Homepage,
    Macbook
  }
}
</script>

<style lang="scss">
#app {
  font-family: Monaco, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
  color: inherit;
}
</style>
