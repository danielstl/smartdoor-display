<template>
  <transition-group id="widgets" name="widgets" tag="div" @before-leave="beforeWidgetLeave">
    <component v-for="component in widgets" :is="component" :key="component"/>
  </transition-group>
</template>

<script>
import ScheduleWidget from "@/components/home/ScheduleWidget";
import PinnedMessagesWidget from "@/components/home/PinnedMessagesWidget";
import WhiteboardWidget from "@/components/home/WhiteboardWidget";

export default {
  name: "HomeScreen",
  components: {WhiteboardWidget, PinnedMessagesWidget, ScheduleWidget},
  data() {
    return {
      widgets: [],
    }
  },
  sockets: {
    widgets_update(widgets) {
      this.widgets = widgets;
    }
  },
  beforeMount() {
    this.$socket.emit("get_widgets");
  },
  methods: {
    beforeWidgetLeave(elem) {
      const {marginLeft, marginTop, width, height} = window.getComputedStyle(elem);

      elem.style.left = `${elem.offsetLeft - parseFloat(marginLeft, 10)}px`
      elem.style.top = `${elem.offsetTop - parseFloat(marginTop, 10)}px`
      elem.style.width = width
      elem.style.height = height
    }
  }
}
</script>

<style>
#widgets {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  max-height: 100%;
}

#widgets > div {
  flex: 1;
}

.widgets-enter-active, .widgets-leave-active {
  transition: all 0.4s ease-in-out;
}

.widgets-enter, .widgets-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.widgets-enter:not(:only-child) {
  flex: 0.000001 !important;
}

.widgets-leave-to:not(:only-child) {
  flex: 0.000001 !important;
}

.widgets-leave-active {
  -position: absolute;
}

.widgets-move {
  transition: all 0.4s ease-in-out;
}
</style>
