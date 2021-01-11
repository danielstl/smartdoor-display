<template>
<div class="pinned-message widget-base">
<img v-if="this.image" :src="this.image"/>
  <div v-if="this.text">{{this.text}}</div>
</div>
</template>

<script>
export default {
name: "PinnedMessage",
  props: {
    text: String,
    image: String
  }
}
</script>

<style scoped>
.pinned-message {
  background-color: yellow;
  padding: 0.5em;
}

.pinned-message {
  margin-bottom: 0.5em;
}

img {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>