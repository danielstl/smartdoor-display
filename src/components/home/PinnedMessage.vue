<template>
  <div class="pinned-message widget-base">
    <DynamicImage v-if="this.note.image" :src="this.note.image"/>
    <div v-if="this.note.text">{{ this.note.text }}</div>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";
export default {
  name: "PinnedMessage",
  components: {DynamicImage},
  props: {
    note: Object
  }
}
</script>

<style scoped>
.pinned-message {
  background-color: #ffff88;
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
