<template>
  <div class="home-banner">
    <XtxCarousel autoPlay :sliders="sliders" />
  </div>
</template>

<script>
import { ref } from 'vue'
// 引入api
import { findBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup () {
    // 存储轮播图
    const sliders = ref([])
    // 获取轮播图
    findBanner().then(data => { sliders.value = data.result })
    return { sliders }
  }
}
</script>

<style lang='less' scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  :deep(.xtx-carousel) {
    .carousel-btn.prev{
      left: 270px;
    }
    .carousel-indicator {
      padding-left: 250px;
    }
  }
}
</style>
