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
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
  <!-- vue动画 -->
  <!-- <Transition>
    <div class="box" v-show="show"></div>
  </Transition> -->
</template>

<script>
// 引入子组件
import HomeCategory from '@/views/home/home-category'
import HomeBanner from '@/views/home/home-banner'
import HomeNew from '@/views/home/home-new'
import HomeHot from '@/views/home/home-hot'
// 引入API
import { ref } from 'vue'
export default {
  name: 'Home',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot },
  setup () {
    const show = ref(true)
    return { show }
  }
}
</script>

<style lang='less' scoped>
// 使用Tranistion组件实现动画，一个元素或者组件的（显示|隐藏，创建|移除）
// 进入前 v-enter (v-enter-from)vue3
// 进入中 v-enter-active
// 进入后 v-enter-to

// 离开前 v-leave (v-leave-from) vue3
// 离开中 v-leave-active
// 离开后 v-leave-to

// 需求：一个盒子在现实隐藏的时候做淡入淡出的动画
// 1. 准备一个盒子
// 2. 控制显示隐藏
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
