<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem >{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 放大镜 -->
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant v-if="goods" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入子组件
import GoodsRelevant from '@/views/goods/goods-relevant'
import GoodsImage from '@/views/goods/goods-image'
import GoodsSales from '@/views/goods/goods-sales'
import GoodsName from '@/views/goods/goods-name'
// 引入vue,vue-router,api
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName },
  setup () {
    // 1. 获取商品详情
    const goods = useGoods()
    return { goods }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品id发生变化，但是不会重新初始化组件
  const route = useRoute()
  const goods = ref(null)
  watch(() => route.params.id, (newValue) => {
    if (newValue && `/product/${newValue}` === route.path) {
      findGoods(route.params.id).then(({ result }) => {
        // 让商品数据为null，让使用v-if的组件可以销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = result
        })
      })
    }
  }, { immediate: true })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}

.goods-footer {
  display: flex;
  margin-top: 20px;

  .goods-article {
    width: 940px;
    margin-right: 20px;
  }

  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
