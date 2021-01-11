<template>
  <div id="user-root">
    <img id="user-icon" src="https://thispersondoesnotexist.com/image"/>
    <div>
      <div id="user-name">{{ this.name }}</div>
      <div id="user-status">
        <svg height="16" width="16">
          <ellipse cx="8" cy="8" rx="8" ry="8" :style="'fill: ' + this.statusColour"/>
        </svg>
        <span>{{ this.statusName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const statusMap = {
  AVAILABLE: {
    name: "Available",
    colour: "green"
  },
  DO_NOT_DISTURB: {
    name: "Do not disturb",
    colour: "red"
  },
  AWAY: {
    name: "Away",
    colour: "orange"
  }
};

export default {
  name: "UserStatus",
  data() {
    return {
      name: "",
      icon: "",
      status: "AVAILABLE"
    }
  },
  sockets: {
    user_update: function (res) {
      this.name = res.name;
      this.icon = res.icon;
      this.status = res.status;
    }
  },
  computed: {
    statusName: function () {
      return statusMap[this.status].name;
    },
    statusColour: function () {
      return statusMap[this.status].colour;
    }
  },
  mounted() {
    this.$socket.emit("get_user");
  }
}
</script>

<style scoped>
#user-root {
  display: flex;
  flex-flow: row;
}

#user-root > div {
  display: flex;
  flex-flow: column;
  align-self: center;
  flex: 1;
}

#user-icon {
  width: 4em;
  height: 4em;
  align-self: center;
  margin-right: 0.6em;
  border-radius: 50%;
}
</style>
