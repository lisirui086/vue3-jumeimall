<template>
  <div class='xtx-carousel' @mouseenter="stop" @mouseleave="start">
    <!-- 轮播图图片容器 -->
    <ul class="carousel-body">
      <!-- fade 显示图片加上 -->
      <li class="carousel-item" :class="{ fade: index === i }" v-for="(item, i) in sliders" :key="i">
        <!-- 图片 -->
        <RouterLink v-if="item.imgUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品列表 item=[] -->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <!-- active 激活点 -->
      <span :class="{ active: index === i }" v-for="(item, i) in sliders" :key="i" @click="index = i"></span>
    </div>
  </div>
</template>

<script>
// 引入组合式API
import { watch, onUnmounted, ref } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 间隔时间
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 控制图片索引
    const index = ref(0)
    // 定义一个定时器
    let timer = null
    // 自动轮播的逻辑
    const autoPlayFn = () => {
      // 清除上一个定时器
      if (timer) {
        clearInterval(timer)
      }
      // 自动播放,每隔多久自动切换下一张
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) index.value = 0
        /* console.log(index.value)
        console.log(props.sliders[index.value].imgUrl) */
      }, props.duration)
    }
    // 侦听sliders数据变化,判断如果有数据并且autoPlay是true
    watch(() => props.sliders, (newValue) => {
      if (newValue.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })

    // 2. 鼠标进入轮播图内暂时,离开后继续自动播放(有开启条件)
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 3. 上一张,下一张
    const toggle = (step) => {
      // 将要改变的索引
      const newIndex = index.value + step
      // 如果超出了
      if (newIndex > (props.sliders.length - 1)) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }
    // autoPlayFn在实例卸载前清除定时器
    onUnmounted(() => clearInterval(timer))
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;

  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }

    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;

      &.fade {
        opacity: 1;
        z-index: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;

        ~span {
          margin-left: 12px;
        }

        &.active {
          background: #fff;
        }
      }
    }

    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, .2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;

      &.prev {
        left: 20px;
      }

      &.next {
        right: 20px;
      }
    }
  }

  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}

// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;

  >a {
    width: 240px;
    text-align: center;

    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }

    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }

    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
