<template>
  <div class="goods-tabs">
    <nav>
      <a @click="activeName='Detail'" :class="{active: activeName==='Detail'}" href="javascript:;">商品详情</a>
      <a @click="activeName='Comment'" :class="{active: activeName==='Comment'}" href="javascript:;">商品评价<span>({{commentInfo.evaluateCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 其实是两个组件 -->
    <!-- <Detail v-if="activeName === 'Detail'" />
    <Comment v-if="activeName === 'Comment'" /> -->
    <component :is="activeName" :commentInfo="commentInfo"></component>
  </div>
</template>

<script>
// 引入vue组合式API
import { ref } from 'vue'
// 引入子组件
import Detail from '@/views/goods/goods-tabs/goods-detail'
import Comment from '@/views/goods/goods-tabs/goods-comment'
// 引入api接口
import { findGoodsCommentInfo } from '@/api/product'
export default {
  name: 'GoodsTabs',
  components: { Detail, Comment },
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    // activeName的值默认是Detail商品详情，Comment商品评价
    const activeName = ref('Detail')
    // 存储商品信息数据
    const commentInfo = ref({})
    // 获取获取商品评价数据 发请求
    findGoodsCommentInfo(props.goods.id).then(({ result }) => {
      // 追加全部评论和有图
      result.tags.unshift({ tagCount: result.hasPictureCount, title: '有图', type: 'img' })
      result.tags.unshift({ tagCount: result.evaluateCount, title: '全部评价', type: 'all' })
      // 将数据给commentInfo
      commentInfo.value = result
    })
    return { activeName, commentInfo }
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
