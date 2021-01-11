<template>
  <div>
    <h1>Messaging</h1>
    <div class="widget-base" id="messages-container">
      <ul id="messages">
        <li v-for="message in messages" :key="message.timestamp">
          <ChatMessage :message="message"/>
        </li>
      </ul>
      <input id="message-box" autocomplete="off" type="text" @keydown.enter="sendMessage" v-model="currentMessage" placeholder="Type a message...">
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
      messages: [
        {
          timestamp: 1000,
          content: "hello",
          selfMessage: true
        }
      ],
      currentMessage: ""
    }
  },
  sockets: {
    new_message: function (messageData) {
      this.messages.push(messageData);
    },
    clear_messages: function () {
      this.messages = [];
    }
  },
  methods: {
    sendMessage(event) {
      this.$socket.emit("send_message", {
        timestamp: new Date().getUTCMilliseconds(),
        content: event ? event.target.value : this.currentMessage,
        selfMessage: false
      });
      if (event) {
        event.target.value = "";
      }
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
}

#message-box {
  font-family: "Roboto", "Segoe UI", "sans-serif";
  padding: 0.8em;
  font-size: large;
  border: 2px solid #a0a0a0;
  border-radius: 10px;
  outline: none;
}
</style>
