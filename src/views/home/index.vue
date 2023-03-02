<template>
  <div class="container">
    <!-- 首页入口（分类+广告） -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
    </div>
  </div>
</template>

<script>
// 引入子组件
import HomeCategory from '@/views/home/home-category'
export default {
  name: 'Home',
  components: { HomeCategory }
}
</script>

<style lang='less' scoped>
</style>
