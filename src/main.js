import Vue from 'vue';
import Screen from "@/components/Screen";
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(new VueSocketio({
  debug: true,
  connection: new SocketIO("https://doorlink.xyz")
}));

new Vue({
  render: h => h(Screen),
}).$mount('#app')
