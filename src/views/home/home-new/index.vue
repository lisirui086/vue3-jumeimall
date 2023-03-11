<template>
  <div class="home-new" ref="target">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- <div ref="target" style="position: relative; height: 426px"> -->
        <!-- 具名插槽 -->
        <template #right>
          <XtxMore path="/" />
        </template>
        <!-- 面板内容 -->
        <Transition name="fade">
          <ul class="goods-list" v-if="goods.length">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img v-lazy="item.picture" alt="">
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <!-- 加载动画 -->
          <HomeSkeleton bg="#f0f9f4" v-else />
        </Transition>
      <!-- </div> -->
    </HomePanel>
  </div>
</template>

<script>
// 引入子组件
import HomePanel from '@/views/home/home-panel'
import HomeSkeleton from '@/views/home/home-skeleton'
// 引入api
import { findNew } from '@/api/home'
// 引入hooks
import { useLazyData } from '@/hooks'
// 引入组合式API
// import { ref } from 'vue'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // 存储获取到的新鲜好物
    // const goods = ref([])
    // const target = ref(null)
    /* findNew().then(data => {
      goods.value = data.result
    }) */
    // 使用hooks内封装的数据懒加载函数
    const { target, result } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}
</style>
