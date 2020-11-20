import Vue from 'vue'
import Screen from "@/components/Screen";

Vue.config.productionTip = false

new Vue({
  render: h => h(Screen),
}).$mount('#app')
