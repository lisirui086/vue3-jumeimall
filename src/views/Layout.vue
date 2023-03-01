<template>
  <!-- 顶部通栏 -->
  <NavBar />
  <!-- 头部组件 -->
  <Header />
  <!-- 主体内容 -->
  <div class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <!-- 底部组件 -->
  <Footer />
</template>

<script>
// 引入子组件
import NavBar from '@/components/navbar'
import Header from '@/components/header'
import Footer from '@/components/footer'
export default {
  name: 'Layout',
  components: {
    NavBar,
    Header,
    Footer
  }
}
</script>

<style lang='less' scoped>
.app-body {
  min-height: 600px;
}
</style>
