<template>
  <div>
    <video autoplay="true" id="cam-feed">

    </video>
  </div>
</template>

<script>
export default {
  name: "IntercomScreen",
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