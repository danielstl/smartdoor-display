<template>
  <div class="pinned-message widget-base">
    <img v-if="this.note.image" :src="this.note.image"/>
    <div v-if="this.note.text">{{ this.note.text }}</div>
  </div>
</template>

<script>
export default {
  name: "PinnedMessage",
  props: {
    note: Object
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
