<template>
  <!-- 首页入口（分类+广告） -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
  </div>
  <!-- 新鲜好物 -->
  <!-- 人气推荐 -->
</template>

<script>
// 引入子组件
import HomeCategory from '@/views/home/home-category'
import HomeBanner from '@/views/home/home-banner'
export default {
  name: 'Home',
  components: { HomeCategory, HomeBanner }
}
</script>

<style lang='less' scoped></style>
