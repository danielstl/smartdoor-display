<template>
  <div id="messaging-root">
    <h1>Messaging</h1>
    <div class="widget-base" id="messages-container">
      <ul id="messages">
        <li v-for="message in messages" :key="message.timestamp">
          <ChatMessage :message="message"/>
        </li>
      </ul>
      <input id="message-box" autocomplete="off" type="text" @keydown.enter="sendMessage" :value="this.currentMessage"  @input="m => this.currentMessage = m.target.value" placeholder="Type a message...">
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/messaging/ChatMessage";

export default {
  name: "MessagingScreen",
  components: {ChatMessage},
  data() {
    return {
      messages: [],
      currentMessage: ""
    }
  },
  sockets: {
    new_message: function (messageData) {
      this.messages.push(messageData);

      var box = document.getElementById("messages");
      box.scrollTop = box.scrollHeight; //scroll to bottom
    },
    clear_messages: function () {
      this.messages = [];
    }
  },
  methods: {
    sendMessage() {
      if (this.currentMessage === "") {
        return;
      }

      this.$socket.emit("send_message", this.currentMessage);
      this.currentMessage = "";
    }
  }
}
</script>

<style scoped>
#messages-container {
  display: flex;
  height: 100%;
  padding: 1em 1em;
  box-sizing: border-box;
  max-height: 100%;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}

#messaging-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

ul {
  list-style: none;
  padding: 0;
}

li:not(:last-child) {
  border-bottom: 1px solid #e2e2e2;
}

#messages {
  flex: 1;

  overflow: auto;
}

#message-box {
  font-family: "Roboto", "Segoe UI", "Helvetica", "sans-serif";
  padding: 0.8em;
  font-size: large;
  border: 2px solid #a0a0a0;
  border-radius: 10px;
  outline: none;
}
</style>
