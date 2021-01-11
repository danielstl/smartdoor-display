<template>
  <div id="root-overlay" :style="{backgroundImage: 'url(' + this.backgroundUrl + ')'}">
    <div id="root">
      <header>
        <UserStatus/>
        <DateTime/>
      </header>
      <main>
        <component :is="this.activeComponent"/>
      </main>
      <nav>
        <ul>
          <li :class="{'selected-item': this.activeScreen === 'home'}" @click="setScreen('home')"><span
              class="material-icons">home</span></li>
          <li :class="{'selected-item': this.activeScreen === 'intercom'}" @click="setScreen('intercom')"><span
              class="material-icons">videocam</span></li>
          <li :class="{'selected-item': this.activeScreen === 'messages'}" @click="setScreen('messages')"><span
              class="material-icons">chat</span></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import UserStatus from "@/components/UserStatus";
import DateTime from "@/components/DateTime";
import HomeScreen from "@/components/home/HomeScreen";
import IntercomScreen from "@/components/intercom/IntercomScreen";

export default {
  name: "Screen",
  components: {HomeScreen, IntercomScreen, DateTime, UserStatus},
  data() {
    return {
      screens: {
        home: "HomeScreen",
        intercom: "IntercomScreen",
        messages: "HomeScreen"
      },
      activeScreen: "home",
      backgroundUrl: null
    }
  },
  async mounted() {
    this.$socket.emit("get_background");
    //let screenData = await fetch("http://localhost:3000/fetch-data/user1", {mode: "no-cors"});

    //store.data = Object.assign({}, store.data, screenData);
  },
  sockets: {
    background_update: function (url) {
      this.backgroundUrl = "http://192.168.1.53:3000" + url; //todo temp
      console.log(url);
    }
  },
  computed: {
    activeComponent: function () {
      return this.screens[this.activeScreen];
    }
  },
  methods: {
    setScreen: function (screen) {
      this.activeScreen = screen;
    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  top: 0;
  left: 0;
  height: 100%;
  user-select: none;
}

header {
  display: flex;
  height: 4em;
}

header > div {
  flex: 1;
}

nav > ul {
  display: flex;
  text-align: center;
}

nav > ul > li {
  flex: 1;
  list-style: none;
}

nav > ul > li > span {
  padding-top: 0.2em;
  border-top: 3px solid transparent;
  transform: scale(1.6, 1.6);
  color: #d4d4d4;
}

nav > ul > li > span {
  transition: all 0.15s;
}

#root, #root-overlay {
  font-family: "Roboto", "Segoe UI", "sans-serif";
  display: flex;
  flex-flow: column;
  height: 100%;
  box-sizing: border-box;

  background-repeat: no-repeat;
  background-size: cover;

  overflow: auto;
  max-height: 100vh;
}

#root {
  padding: 0.5em;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

main {
  flex: 1;
}

nav {
  height: 5em;
}

.selected-item > span {
  border-top: 3px solid #6c6cff;
  transform: scale(1.8, 1.8);
  color: white;
}
</style>
