<template>
  <div class="goods-tabs">
    <nav>
      <a @click="activeName='Detail'" :class="{active: activeName==='Detail'}" href="javascript:;">商品详情</a>
      <a @click="activeName='Comment'" :class="{active: activeName==='Comment'}" href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 其实是两个组件 -->
    <!-- <Detail v-if="activeName === 'Detail'" />
    <Comment v-if="activeName === 'Comment'" /> -->
    <component :is="activeName"></component>
  </div>
</template>

<script>
import { ref } from 'vue'
import Detail from '@/views/goods/goods-tabs/goods-detail'
import Comment from '@/views/goods/goods-tabs/goods-comment'
export default {
  name: 'GoodsTabs',
  components: { Detail, Comment },
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  setup () {
    // activeName的值默认是Detail商品详情，Comment商品评价
    const activeName = ref('Detail')
    return { activeName }
  }
}
</script>

<style scoped lang="less">
.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
