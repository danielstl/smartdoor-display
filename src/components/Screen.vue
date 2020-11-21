<template>
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
        <li @click="setScreen('home')">Home</li>
        <li @click="setScreen('intercom')">Intercom</li>
        <li @click="setScreen('messages')">Messages</li>
      </ul>
    </nav>
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
      activeScreen: "home"
    }
  },
  computed: {
    activeComponent: function() {
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

#root {
  background-color: #eee;
  padding: 0.5em;
  font-family: "Roboto", "Segoe UI", "sans-serif";
  display: flex;
  flex-flow: column;
  height: 100%;
  box-sizing: border-box;

  overflow: auto;
  max-height: 100vh;
}

main {
  flex: 1;
}
</style>