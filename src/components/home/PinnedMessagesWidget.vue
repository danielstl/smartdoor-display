<template>
  <div id="pinned-messages">
    <PinnedMessage v-for="(note, ix) in notes" :key="ix" :note="note"/>
    <div id="no-notes" v-if="notes.length === 0">
      <div>No notes are pinned</div>
    </div>
  </div>
</template>

<script>
import PinnedMessage from "@/components/home/PinnedMessage";

export default {
  name: "PinnedMessagesWidget",
  components: {PinnedMessage},
  data() {
    return {
      notes: []
    }
  },
  sockets: {
    notes_update: function (notes) {
      this.notes = notes;
    }
  },
  mounted() {
    this.$socket.emit("get_notes");
  }
}
</script>

<style scoped>
#pinned-messages {
  overflow-y: scroll;
}

#no-notes {
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
