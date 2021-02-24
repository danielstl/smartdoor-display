<template>
  <div id="registration-root">
    <template v-if="autoPair">
      <div class="header">Connecting...</div>
    </template>
    <template v-else-if="!pairComplete">
      <img alt="DoorLink logo" id="logo" src="https://doorlink.xyz/display/icons/256.png"/>
      <div class="header">Welcome to DoorLink</div>
      <div>To get started, you need to pair this display with the DoorLink Management application</div>
      <div class="subtitle">Visit the Device page, and then scan the QR code using the camera view below</div>

      <div id="room-join-options">
        <button @click="promptForCode">Enter code manually</button>
      </div>

      <div id="camera-container">
        <qrcode-stream @decode="attemptToJoin"></qrcode-stream>
      </div>
    </template>
    <template v-else>
      <div class="header">Pairing complete!</div>
      <div><UserStatus></UserStatus></div>
    </template>
  </div>
</template>

<script>
import {QrcodeStream} from "vue-qrcode-reader";
import UserStatus from "@/components/UserStatus";

export default {
  name: "RegistrationScreen",
  components: {
    UserStatus,
    QrcodeStream
  },
  data() {
    return {
      pairComplete: false,
      autoPair: false
    }
  },
  beforeMount() {
    let code = localStorage.displayRoomCode;

    if (code) {
      this.autoPair = true;
      this.attemptToJoin(code, false); //we already have a saved room code
    }
  },
  sockets: {
    room_joined: function (code) {
      this.pairComplete = true;

      setTimeout(() => {
        this.$emit("room-joined", code);
      }, this.autoPair ? 0 : 3000);
    },
    invalid_room_code: function () {
      this.$global.pushToast(this.autoPair ? "The previous code used is now invalid, please pair the display again" : "Invalid room code, please try again")
      this.autoPair = false;
    }
  },
  methods: {
    attemptToJoin: function (content, newPairing) {
      this.$socket.emit("join_room", content, newPairing);
    },
    promptForCode: function() {
      let res = prompt("Please enter a Door ID, which you can find in DoorLink Management > Device");

      if (res) {
        this.attemptToJoin(res, true);
      }
    }
  }
}
</script>

<style scoped>
#registration-root {
  position: fixed;
  background-color: #3b3b3b;
  color: #ececec;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

#logo {
  width: 64px;
  height: 64px;
}

.header {
  font-size: x-large;
  font-weight: 600;
  margin-top: 0.6em;
  margin-bottom: 0.25em;
}

@keyframes camera-pulse {
  0% {
    border-color: #1e76ff;
  }
  50% {
    border-color: #9cc1ff;
  }
  100% {
    border-color: #1e76ff;
  }
}

#camera-container {
  height: 50vh;
  width: 50vw;
  border-radius: 10px;
  overflow: hidden;

  border: 3px solid;

  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 8px;

  animation: camera-pulse infinite 4s;
}

#room-join-options {
  display: flex;
  width: 50vw;
  margin: 1.25em 0;

  border-radius: 2px;
  overflow: hidden;
  gap: 2px;
}

#room-join-options > button {
  flex: 1;
  outline: none;

  background-color: white;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 0.75em;
  color: black;
  font-family: "Roboto", "Segoe UI", "Helvetica", "sans-serif";

  transition: all 0.2s ease-in-out;
}

#room-join-options > button:hover {
  background-color: #e7e7e7;
}

input, select, button :active {
  outline: none;
}

</style>
