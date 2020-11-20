<template>
  <div id="user-root">
    <img src="" width="100"/>
    <div>
      <div id="user-name">Daniel Stoliar</div>
      <div id="user-status">
        <img/><span>Available</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserStatus"
}
</script>

<style scoped>
#user-root {
  display: flex;
  flex-direction: column;
}

#user-root > * {
  flex: 1;
}
</style>