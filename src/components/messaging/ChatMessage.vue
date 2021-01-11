<template>
  <div :class="{message: true, 'self-message': message.selfMessage}">
    <div class="message-timestamp">{{formattedTime}}</div>
    <div>
      <div class="message-author">{{ message.selfMessage ? "owner" : "you" }}</div>
      <div class="message-content">{{message.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessage",
  props: {
    message: Object
  },
  computed: {
    formattedTime: function () {
      let date = new Date();
      date.setUTCMilliseconds(this.message.timestamp);
      return date.toLocaleTimeString("en-GB", {hour:"2-digit", minute: "2-digit", hour12: false});
    }
  }
}
</script>

<style scoped>
.message {
  display: flex;
  padding: 0.4em 0;
}

.self-message {
  -flex-direction: row-reverse;
}

.message-timestamp {
  margin-right: 0.5em;
}

.message-content {
  font-size: larger;
}
</style>
