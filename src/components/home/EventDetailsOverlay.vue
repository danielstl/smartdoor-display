<template>
  <div id="modal-overlay">
    <div id="modal-main-content">
      <div id="modal-header">{{this.event.title}}</div>
      <div>Event</div>
      <div>{{this.event}}</div>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventDetailsOverlay",
  props: {
    event: Object
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
}
</script>

<style scoped>
#modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  top: 0;
  left: 0;

  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

#modal-main-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  flex: 1;
}

#modal-header {
  font-weight: 600;
  color: white;
  text-align: center;
  font-size: xx-large;

  padding: 0.75em;
}


</style>
