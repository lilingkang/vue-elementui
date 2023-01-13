<template>
  <div>
    <iframe src="../../static/html/404.html" ref="iframeDom"></iframe>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
iframe{
  width: 100vw;
  height: 100vh;
  border-width: 0;
  position: fixed;
  top: 0;
  right: 0;
}

</style>
