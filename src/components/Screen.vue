<template>
  <div id="root-overlay" :style="{backgroundImage: 'url(' + this.backgroundUrl + ')'}">
    <Toast v-show="this.toastVisible" :caption="toast"/>
    <RegistrationScreen v-if="requiresRegistration" @room-joined="roomJoined"/>
    <div id="root" v-else>
      <header>
        <UserStatus/>
        <DateTime/>
      </header>
      <main>
        <transition name="page-switch" mode="out-in">
          <component :is="this.activeComponent"/>
        </transition>
      </main>
      <nav>
        <ul>
          <li :class="{'selected-item': this.activeScreen === 'home'}" @click="setScreen('home')"><span
              class="material-icons">home</span></li>
          <li :class="{'selected-item': this.activeScreen === 'intercom'}" @click="setScreen('intercom', true)"><span
              class="material-icons">videocam</span></li>
          <li :class="{'selected-item': this.activeScreen === 'messages'}" @click="setScreen('messages', true)"><span
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
import MessagingScreen from "@/components/messaging/MessagingScreen";
import RegistrationScreen from "@/components/registration/RegistrationScreen";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";

export default {
  name: "Screen",
  components: {Modal, Toast, RegistrationScreen, HomeScreen, IntercomScreen, MessagingScreen, DateTime, UserStatus},
  data() {
    return {
      screens: {
        home: "HomeScreen",
        intercom: "IntercomScreen",
        messages: "MessagingScreen"
      },
      toast: null,
      toastVisible: false,
      requiresRegistration: true,
      roomId: null,
      activeScreen: "home",
      backgroundUrl: null,
      initialConnection: false,
      invalidationReconnect: false
    }
  },
  async mounted() {

    //let screenData = await fetch("http://localhost:3000/fetch-data/user1", {mode: "no-cors"});

    //store.data = Object.assign({}, store.data, screenData);

    this.$global.pushToast = this.pushToast;
  },
  sockets: {
    background_update(url) {
      this.backgroundUrl = url;
      console.log(url);
    },
    room_invalidate() { //server has invalidated our room code and disconnected us...
      delete localStorage.displayRoomCode;
      this.roomId = null;
      this.requiresRegistration = true;
      this.invalidationReconnect = true;

      this.pushToast("This device has been disconnected from the system")
    },
    disconnect(reason) {
      if(reason === 'io server disconnect') {
        this.$socket.connect();
      }

      if (this.initialConnection && !this.invalidationReconnect) {
        this.pushToast("Disconnected from server, reconnecting...")
      }
    },
    connect() {
      if (this.initialConnection && !this.invalidationReconnect) { //already connected before, we must have been disconnected...
        this.requiresRegistration = true;
        this.pushToast("Reconnected to server")
      }

      this.invalidationReconnect = false;
      this.initialConnection = true;
    }
  },
  computed: {
    activeComponent() {
      return this.screens[this.activeScreen];
    }
  },
  methods: {
    setScreen(screen, disallowDoNotDisturb) {
      if (disallowDoNotDisturb && this.$global.user.status === "DO_NOT_DISTURB") {
        this.pushToast("This feature cannot be used whilst Do Not Disturb is active");
        return;
      }
      this.activeScreen = screen;
    },

    roomJoined(code) {
      //todo: store in http storage

      this.roomId = code;
      this.requiresRegistration = false;

      localStorage.displayRoomCode = code; //save the code!
      this.$global.roomId = code;

      this.$socket.emit("get_background");
    },
    pushToast(message) {
      this.toast = message;
      this.toastVisible = true;

      setTimeout(() => this.toastVisible = false, 4000);
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
  font-family: "Roboto", "Segoe UI", "Helvetica", "sans-serif";
  display: flex;
  flex-flow: column;
  height: 100vh;
  box-sizing: border-box;

  background-repeat: no-repeat;
  background-size: cover;

  max-height: 100vh;
}

#root {
  padding: 0.5em;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

main {
  flex: 1;
  padding: 1em 0;

  overflow: auto;
}

nav {
  height: 5em;
}

.selected-item > span {
  border-top: 3px solid #6c6cff;
  transform: scale(1.8, 1.8);
  color: white;
}

.widget-base {
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
  margin: 0.3em;
  background-color: white;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

input[type=text], select, button, input[type=submit], input[type="file"]::-webkit-file-upload-button {
  background-color: white;
  border: 1px solid #333;
  border-radius: 2px;
  padding: 0.4em;
  color: black;
  outline: none;
  font-family: "Roboto", "Segoe UI", "Helvetica", "sans-serif";

  transition: background-color 0.25s;
}

button:hover {
  background-color: #f1f1f1;
}

.page-switch-enter-active, .page-switch-leave-active {
  transition: all 0.2s ease-in-out;
}

.page-switch-enter, .page-switch-leave-to {
  opacity: 0;
}
</style>
