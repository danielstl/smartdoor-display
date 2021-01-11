<template>
<div id="pinned-messages">
  <PinnedMessage text="hello"/>
  <PinnedMessage image="/hello.png"/>
  <PinnedMessage image="/hello.png"/>
  <PinnedMessage text=":)"/>
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
}
</style>
