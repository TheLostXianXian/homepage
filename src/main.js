import Vue from "vue"

import App from "./App.vue"
import "./common/style/reset.css"
import "./common/style/devices.css"
import "./registerServiceWorker"

Vue.config.productionTip = false

Vue.directive("focus", {
  inserted(el) {
    el.focus()
  }
})

new Vue({
  render: h => h(App)
}).$mount("#app")
