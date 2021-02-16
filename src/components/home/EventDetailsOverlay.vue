<template>
  <div id="modal-overlay">
    <div id="modal-main-content">
      <div id="modal-header">Event Details</div>
      <div id="event-details">{{ event.title }}</div>
      <div>{{ timeUntilEvent }}</div>
      <button id="close" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventDetailsOverlay",
  props: {
    event: Object
  },
  data() {
    return {
      timeUntilEvent: ""
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    updateTimeUntilEvent() {

      let date = new Date(this.event.startEpoch);
      let until = date - new Date();

      let inPast = until < 0;
      let inProgress = inPast && this.event.endEpoch > new Date();

      until = Math.abs(until);

      let hours = until / 3600000 | 0;
      let mins = until % 3600000 / 60000 | 0;
      let secs = Math.round(until % 60000 / 1000);

      let format = "";

      if (hours > 0) {
        format += hours + " hour" + (hours === 1 ? " " : "s ");
      }

      if (mins > 0) {
        format += mins + " minute" + (mins === 1 ? " " : "s ");
      }

      if (mins === 0 && hours === 0) {
        format += secs + " sec" + (secs === 1 ? " " : "s ");
      }

      if (inProgress) {
        this.timeUntilEvent = "In progress, started " + format + "ago";
      } else if (inPast) {
        this.timeUntilEvent = "Event has finished, started " + format + "ago";
      } else {
        this.timeUntilEvent = "Event starts in " + format;
      }
    }
  },
  mounted() {
    this.updateTimeUntilEvent();

    this.updateId = setInterval(this.updateTimeUntilEvent, 1000);
  },
  beforeDestroy() {
    clearInterval(this.updateId);
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

  font-size: larger;
}

#modal-header {
  font-weight: 600;
  color: white;
  text-align: center;
  font-size: xx-large;

  padding: 0.2em;
}

#event-details {
  font-weight: 500;

  font-size: x-large;

  padding: 0.2em;
}

#close {

  border: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
  border-radius: 8px;
  padding: 0.8em 2em;
  margin-top: 2em;
  font-size: large;
}
</style>
