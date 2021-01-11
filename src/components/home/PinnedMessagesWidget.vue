<template>
<div id="pinned-messages">
  <PinnedMessage text="hello"/>
  <PinnedMessage image="/hello.png"/>
  <PinnedMessage image="/hello.png"/>
  <PinnedMessage/>
</div>
</template>

<script>
import PinnedMessage from "@/components/home/PinnedMessage";
export default {
  name: "PinnedMessagesWidget",
  components: {PinnedMessage}
}
</script>

<style scoped>
#pinned-messages {
  overflow-y: scroll;
  max-height: 590px; /*todo fix this*/
}

::-webkit-scrollbar {
  width: 0px;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
</style>