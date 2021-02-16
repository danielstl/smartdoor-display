<template>
  <div id="intercom-root">
    <Modal v-if="modalVisible" @positive="startCall" @negative="cancelCall">
      <div id="temp"
           style="height: 100%; text-align: center; display: flex; flex-flow: column; align-items: center; justify-content: center;">
        <DynamicImage :src="this.$global.user.profileImage" style="height: 100px; width: 100px; border-radius: 50%;"/>
        <p style="font-size: 24pt; font-weight: 500;">Do you want to call {{ this.$global.user.name }}?</p>
      </div>
    </Modal>
    <div id="intercom-header">
      <h1>Intercom</h1>
      <button v-if="callInProgress || pendingCall" id="end-call-button" @click="endCall">{{ pendingCall ? "CANCEL CALL" : "END CALL" }}</button>
    </div>
    <div id="cam-containers">
      <div id="received-camera">
        <video autoplay id="received-cam-feed" class="widget-base">

        </video>
        <span id="pending-call-overlay" :class="{declined: callDeclined}" v-if="pendingCall">
          <div v-if="!callDeclined">
            Waiting for a response...
          </div>
          <div v-else>
            Call declined
          </div>
        </span>
        <div id="self-camera">
          <video autoplay muted id="cam-feed" class="widget-base">

          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import DynamicImage from "@/components/DynamicImage";

export default {
  name: "IntercomScreen",
  components: {DynamicImage, Modal},
  data() {
    return {
      modalVisible: true,
      pendingCallRequestId: null,
      pendingCall: false,
      callDeclined: false,
      callInProgress: false
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
  beforeDestroy() {
    this.endCall();
  },
  sockets: {
    decline_call_request(id) {
      if (this.pendingCallRequestId === id) {

        this.callDeclined = true;

        setTimeout(() => {
          this.$parent.setScreen("home");
        }, 3000);

        this.pendingCallRequestId = null;
      }
    },
    end_intercom_call(id) {
      if (this.pendingCallRequestId === id) {
        this.endCall();
      }
    },
    async intercom_call_signalling(data) {
      if (data.id !== this.pendingCallRequestId) {
        return;
      }

      console.log("recieved signal", data);
      if (data.message === "candidate") {
        await this.rtc.addIceCandidate(new RTCIceCandidate(data.candidate));

      } else if (data.message === "sdp") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        let answer = await this.rtc.createAnswer();
        await this.rtc.setLocalDescription(answer);

        this.$socket.emit("intercom_call_signalling", {
          id: this.pendingCallRequestId,
          message: "sdp_remote",
          sdp: answer
        })
      } else if (data.message === "sdp_remote") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    }
  },
  methods: {
    startCall() {
      this.modalVisible = false;

      console.log("start call!");

      this.pendingCallRequestId = (Math.random() * 99999999).toString();

      this.$socket.emit("start_intercom_call", this.pendingCallRequestId);

      this.pendingCall = true;

      let currrentId = this.pendingCallRequestId;

      setTimeout(() => {
        if (!this.callInProgress && this.pendingCallRequestId === currrentId) {
          this.$global.pushToast("No call response has been received");
          this.endCall();
        }
      }, 30 * 1000);
    },
    endCall() {
      this.rtc.close();

      if (this.pendingCallRequestId && this.callInProgress) {

        this.$socket.emit("end_intercom_call", this.pendingCallRequestId);

        this.pendingCallRequestId = null;
        this.callInProgress = false;

        this.$global.pushToast("Intercom call has been ended");
      }

      document.getElementById("cam-feed").srcObject = null;
      document.getElementById("received-cam-feed").srcObject = null;

      this.cancelCall();
    },
    attachMediaStream(stream) {
      let camFeed = document.getElementById("received-cam-feed");

      camFeed.srcObject = stream;

      this.pendingCall = false;
      this.callInProgress = true;
    },
    onIceCandidate(event) {
      console.log(event.candidate);

      if (event.candidate !== undefined) {
        console.log("emitting candidate", event.candidate);
        this.$socket.emit("intercom_call_signalling", {
          id: this.pendingCallRequestId,
          message: "candidate",
          candidate: event.candidate
        });
      }
    },
    onAddStream(event) {
      console.log(event);

      this.attachMediaStream(event.stream);

      this.callInProgress = true;
    },
    cancelCall() {
      this.$parent.setScreen("home");
    }
  }
}
</script>

<style scoped>
/*#received-camera {
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
}*/

#intercom-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: auto;
}

#self-camera {
  position: absolute;
  display: inline-block;
  width: 30vw;
  height: 16.125vw;
  right: 1em;
  bottom: 1em;
}

video {
  background-color: #292929;
}

#self-camera video {
  border: 2px solid white;
}

#received-camera {
  position: relative;
  width: 100%;
  height: 100%;

  overflow: hidden;
}

#received-camera video {
  width: 100%;
  height: 100%;
}

#cam-containers {
  -display: flex;
  height: 100%;
  max-width: 100%;
  -box-sizing: border-box;
  max-height: 100%;
  flex: 1;
  overflow: hidden;
}

.widget-base {
  margin: 0;
}

@keyframes waiting-pulse {
  0% {
    background-color: rgba(113, 113, 255, 1);
  }

  50% {
    background-color: rgba(113, 113, 255, 0.8);
  }

  100% {
    background-color: rgba(113, 113, 255, 1);
  }
}

#pending-call-overlay {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  color: white;
  position: absolute;
  border-radius: 8px;

  font-size: xx-large;
  font-weight: 500;

  justify-content: center;
  align-items: center;
}

#pending-call-overlay:not(.declined) {
  animation: waiting-pulse 2s infinite;
}

.declined {
  animation: none;
  background-color: #d70000;
}

#intercom-header {
  display: flex;
  align-items: center;
}

#end-call-button {
  height: 3em;
  padding-left: 1.5em;
  padding-right: 1.5em;
  background-color: #ff1e1e;
  color: white;
  font-weight: 600;
  font-size: large;
  border-radius: 8px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
  cursor: pointer;
}

#intercom-header > h1 {
  flex: 1;
}

</style>
