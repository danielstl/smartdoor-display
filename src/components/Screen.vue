<template>
  <div id="root">
    <header>
      <UserStatus/>
      <DateTime/>
    </header>
    <main>
      <HomeScreen/>
    </main>
    <nav>
      <ul>
        <li>Home</li>
        <li>Intercom</li>
        <li>Messages</li>
      </ul>
    </nav>
  </div>
</template>

<script>
import UserStatus from "@/components/UserStatus";
import DateTime from "@/components/DateTime";
import HomeScreen from "@/components/home/HomeScreen";

export default {
  name: "Screen",
  components: {HomeScreen, DateTime, UserStatus}
}
</script>

<style>
body, html {
  margin: 0;
  top: 0;
  left: 0;
  height: 100%;
}

header {
  display: flex;
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