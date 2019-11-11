<template>
  <div id="app">
    <macbook>
      <homepage />
    </macbook>
    <v-footer></v-footer>
  </div>
</template>

<script>
import Homepage from "./views/homepage"
import Macbook from "./views/macbook"
import VFooter from "@/components/footer"
export default {
  name: "app",
  components: {
    Homepage,
    Macbook,
    VFooter
  }
}
</script>

<style lang="scss">
body {
  background: rgb(238, 174, 202);
  background: radial-gradient(
    circle,
    rgba(238, 174, 202, 1) 0%,
    rgba(148, 187, 233, 1) 100%
  );
}

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
