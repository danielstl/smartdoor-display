<template>
  <transition name="slide-up">
    <div class="toast">
      {{ caption }}
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  props: {
    caption: String
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  width: 100%;
  background-color: #3b3b3b;
  left: 0;
  bottom: 0;
  padding: 0.8em;
  font-size: x-large;
  color: white;
  overflow: hidden;
  text-align: center;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(.17,.67,.12,1);
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(80px);
  opacity: 0;
}

</style>
