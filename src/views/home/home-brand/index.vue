<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template #right>
      <a @click="toggle(-1)" :class="{disabled: index === 0}" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(1)" :class="{disabled: index === 1}"  href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <div class="box" ref="target">
      <Transition name="fade">
      <ul v-if="brands.length" class="list" :style="{transform: `translateX(${-index*1240}px)`}" >
        <li v-for="brand in brands" :key="brand.id">
          <RouterLink :to="`/category/${brand.id}`">
            <img :src="brand.logo" :alt="brand.name">
          </RouterLink>
        </li>
      </ul>
      <!-- 骨架动画 -->
      <div v-else class="skeleton">
        <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
      </div>
    </Transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from '@/views/home/home-panel'
// 引入api
import { findBrand } from '@/api/home'
// 引入组合式API
import { ref } from 'vue'
// 引入hooks
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // 存储findBrand获取的数据
    // const brands = ref([])
    // 通过api接口获取请求
    /* findBrand(10).then(data => {
      brands.value = data.result
    }) */
    // 切换品牌
    const index = ref(0)
    const toggle = (step) => {
      const newIndex = index.value + step
      if (newIndex < 0 || newIndex > 1) return
      index.value = newIndex
    }
    // 实现数据懒加载
    // 注意：useLazyData需要的是API函数，如果遇到要传参的情况， 自己写函数在函数内调用API
    const { target, result } = useLazyData(() => findBrand(10))
    return { brands: result, toggle, index, target }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
