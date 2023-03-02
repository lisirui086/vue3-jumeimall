<template>
  <!-- 顶部通栏 -->
  <NavBar />
  <!-- 头部组件 -->
  <Header />
  <!-- 吸顶组件 -->
  <HeaderNav />
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
import HeaderNav from '@/components/header/header-sticky'
// 引入vuex
import { useStore } from 'vuex'
// 引入vue
// import { computed } from 'vue'
export default {
  name: 'Layout',
  components: {
    NavBar,
    Header,
    Footer,
    HeaderNav
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getCategoryList')
  }
}
</script>

<style lang='less' scoped>
.app-body {
  min-height: 600px;
}
</style>
