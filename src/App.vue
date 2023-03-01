<template>
  <!-- vue2.0需要根元素 vue3.0可以是代码片段，Fragment -->
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  setup () {
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
