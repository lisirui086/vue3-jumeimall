<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <div ref="target" style=" position: relative; height: 426px">
        <!-- 右上角插槽 -->
        <!-- 默认插槽 -->
        <Transition name="fade">
          <ul class="goods-list" v-if="list.length">
            <li v-for="item in list" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" :alt="item.alt">
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
          <!-- 加载动画 -->
          <HomeSkeleton bg="#f0f9f4" v-else />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
// 引入子组件
import HomePanel from '@/views/home/home-panel'
import HomeSkeleton from '@/views/home/home-skeleton'
// 引入组合式api
// import { ref } from 'vue'
// 引入api
import { findHot } from '@/api/home'
// 引入hooks
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const list = ref([])
    // findHot().then(data => { list.value = data.result })
    // 获取DOm
    // const target = ref(null)
    // 调用数据懒加载
    // 1. target 去绑定一个监听对象
    const { target, result } = useLazyData(findHot)
    return { list: result, target }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
