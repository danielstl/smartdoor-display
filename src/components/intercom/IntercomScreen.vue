<template>
  <div id="intercom-root">
    <Modal v-if="modalVisible" @positive="startCall" @negative="cancelCall">
      <div id="temp" style="height: 100%; text-align: center; display: flex; flex-flow: column; align-items: center; justify-content: center;">
        <img :src="this.$global.user.profileImage" style="height: 100px; width: 100px; border-radius: 50%;"/>
        <p style="font-size: 24pt; font-weight: 500;">Do you want to call {{ this.$global.user.name }}?</p>
      </div>
    </Modal>
    <h1>Intercom</h1>
    <div id="cam-containers">
      <div id="received-camera">
        <video autoplay id="received-cam-feed" class="widget-base">

        </video>
      </div>
      <div id="self-camera">
        <video autoplay muted id="cam-feed" class="widget-base">

        </video>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "IntercomScreen",
  components: {Modal},
  data() {
    return {
      modalVisible: true
    }
  },
  async mounted() {
    const config = {iceServers: [{urls: "stun:stun.l.google.com:19305"}]};

    console.log("11");

    this.rtc = new RTCPeerConnection(config);

    this.rtc.onicecandidate = this.onIceCandidate;

    let camFeed = document.getElementById("cam-feed");
    let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

    camFeed.srcObject = stream;
    this.rtc.addStream(stream);

    console.log(this.rtc);

    this.rtc.onaddstream = this.onAddStream;

  },
  sockets: {
    intercom_call_signalling: async function (data) {
      console.log("recieved signal", data);
      if (data.message === "candidate") {
        await this.rtc.addIceCandidate(new RTCIceCandidate(data.candidate));

      } else if (data.message === "sdp") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        let answer = await this.rtc.createAnswer();
        await this.rtc.setLocalDescription(answer);

        this.$socket.emit("intercom_call_signalling", {message: "sdp_remote", sdp: answer})
      } else if (data.message === "sdp_remote") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    }
  },
  methods: {
    async startCall() {
      this.modalVisible = false;

      console.log("start call!");

      this.description = await this.rtc.createOffer();
      await this.rtc.setLocalDescription(this.description);

      this.$socket.emit("start_intercom_call", this.description);
    },
    attachMediaStream(stream) {
      let camFeed = document.getElementById("received-cam-feed");

      camFeed.srcObject = stream;
    },
    onIceCandidate(event) {
      console.log(event.candidate);

      if (event.candidate !== undefined) {
        console.log("emitting candidate", this);
        this.$socket.emit("intercom_call_signalling", {message: "candidate", candidate: event.candidate});
      }
    },
    onAddStream(event) {
      console.log(event);

      this.attachMediaStream(event.stream);
    },
    cancelCall() {
      this.$parent.setScreen("home");
    }
  }
}
</script>

<style scoped>
#received-camera {
  flex: 2;
}

#self-camera {
  flex: 1;
}

#cam-containers > div {
  -height: 56.25%;
  margin: 0.3em;
}

video {
  width: 100%;
  max-height: 100%;
  margin: 0;
  background-color: #0c0c0c;
}

#intercom-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

#cam-containers {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  max-height: 100%;
  flex: 1;
  overflow: auto;
}
</style>
