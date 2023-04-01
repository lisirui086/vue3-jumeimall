<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{ goods.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{ goods.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 放大镜 -->
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 商品信息 -->
          <GoodsName :goods="goods" />
          <!-- sku选择商品规格 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 添加商品数量 -->
          <XtxNumbox v-model="num" :max="goods.inventory" label="数量" />
          <!-- 添加到购物车按钮 -->
          <XtxButton @click="insertCart" type="primary" style="margin-top:20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant v-if="goods" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :goods="goods" />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
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
import GoodsSku from '@/views/goods/goods-sku'
import GoodsTabs from '@/views/goods/goods-tabs'
import GoodsHot from '@/views/goods/goods-hot'
import GoodsWarn from '@/views/goods/goods-warn'
// 引入vue,vue-router,api
import { nextTick, ref, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    // 添加商品数量
    const num = ref(1)
    // 1. 获取商品详情
    const goods = useGoods()
    const currSku = ref(null)
    const changeSku = (sku) => {
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku，可能有数据，可能没有数据{} 是空对象就代表没有选择完整
      currSku.value = sku
    }
    // 添加到购物车
    const store = useStore()
    const insertCart = () => {
      // 约定加入购物车字段必须和后端保持一致
      // 他们是：id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
      if (currSku.value && currSku.value.skuId) {
        store.dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: num.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        })
      } else {
        // 消息提示
        Message({ text: '请选择完整规格' })
      }
    }
    // 提供数据给后代组件使用
    provide('goods', goods)
    return { goods, changeSku, num, insertCart }
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

// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
