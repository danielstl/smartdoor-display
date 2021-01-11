<template>
  <div>
    <Modal/>
    <video autoplay="true" id="cam-feed">

    </video>
    <button @click="alert('a')"/>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
export default {
  name: "IntercomScreen",
  components: {Modal},
  mounted() {
    let camFeed = document.getElementById("cam-feed");

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
          .then(function (stream) {
            camFeed.srcObject = stream;
          })
          .catch(function (e) {
            alert(e);
          });
    }
  }
}
</script>

<style scoped>
#cam-feed {
  width: 60%;
}
</style>