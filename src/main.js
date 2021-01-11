import Vue from 'vue';
import Screen from "@/components/Screen";
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(new VueSocketio({
  debug: true,
  connection: new SocketIO("http://192.168.1.53:3000")
}));

new Vue({
  render: h => h(Screen),
}).$mount('#app')
