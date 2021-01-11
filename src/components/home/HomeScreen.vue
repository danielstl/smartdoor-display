<template>
  <div id="widgets">
    <ScheduleWidget/>
    <PinnedMessagesWidget/>
    <WhiteboardWidget/>
  </div>
</template>

<script>
import ScheduleWidget from "@/components/home/ScheduleWidget";
import PinnedMessagesWidget from "@/components/home/PinnedMessagesWidget";
import WhiteboardWidget from "@/components/home/WhiteboardWidget";

export default {
  name: "HomeScreen",
  components: {WhiteboardWidget, PinnedMessagesWidget, ScheduleWidget}
}
</script>

<style>
#widgets {
  display: flex;
  height: 100%;
  padding: 1em 0;
  box-sizing: border-box;
  max-height: 100%;
}

#widgets > div {
  flex: 1;
}
</style>
