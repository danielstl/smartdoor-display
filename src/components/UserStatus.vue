<template>
  <div id="user-root">
    <DynamicImage id="user-icon" :src="this.user.profileImage"/>
    <div>
      <div id="user-name">{{ this.user.name }}</div>
      <div id="user-status">
        <svg height="16" width="16">
          <ellipse cx="8" cy="8" rx="8" ry="8" :style="'fill: ' + this.statusColour"/>
        </svg>
        <span id="status-text" :style="{'color': this.statusColour}">{{ this.statusName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";
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
  components: {DynamicImage},
  data() {
    return {
      user: {
        name: "",
        icon: "",
        status: "AVAILABLE",
        profileImage: ""
      }
    }
  },
  sockets: {
    user_update: function (res) {
      this.user.name = res.name;
      this.user.icon = res.icon;
      this.user.status = res.status;
      this.user.profileImage = res.profileImage;

      this.$global.user = this.user;
    }
  },
  computed: {
    statusName: function () {
      return statusMap[this.user.status].name;
    },
    statusColour: function () {
      return statusMap[this.user.status].colour;
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

  font-size: 26px;
  font-weight: 500;
}

#user-root > div {
  display: flex;
  flex-flow: column;
  align-self: center;
  flex: 1;

  margin-top: 0.3em;
}

#status-text {
  margin-left: 0.2em;
}

#user-status > svg {
  margin-bottom: 0.05em;
}

#user-icon {
  width: 4rem;
  height: 4rem;
  align-self: center;
  margin-right: 0.6rem;
  border-radius: 50%;
}
</style>
