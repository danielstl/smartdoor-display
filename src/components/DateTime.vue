<template>
  <div id="time-root">
    <div id="time">{{ time }}</div>
    <div id="date">{{ date }}</div>
  </div>
</template>

<script>
export default {
  name: "DateTime",
  data() {
    return {
      date: "",
      time: ""
    }
  },
  mounted() {
    this.updateTime();

    this.intervalId = window.setInterval(this.updateTime, 1000);

    document.getElementById("time").onclick = () => {
      document.documentElement.requestFullscreen();
    };
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  },
  methods: {
    updateTime: function () {
      let now = new Date();

      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      this.time = (now.getHours() < 10 ? "0" : "") + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      this.date = weekdays[now.getDay()] + " " + now.getDate() + " " + months[now.getMonth()];
    }
  }
}
</script>

<style scoped>
#time-root {
  text-align: right;
}

#time {
  font-weight: 500;
  font-size: xx-large;
}

#date {
  font-size: 1.3em;
}
</style>
