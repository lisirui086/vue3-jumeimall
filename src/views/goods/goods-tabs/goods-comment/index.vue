<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;" @click="changeTag(i)" :class="{ active: currTagIndex === i }"
            v-for="(item, i) in commentInfo.tags" :key="item.title">{{ item.title }}({{ item.tagCount }})</a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="total">
      <span>排序：</span>
      <a href="javascript:;" @click="changeSort(null)" :class="{ active: reqParams.sortField === null }">默认</a>
      <a href="javascript:;" @click="changeSort('createTime')"
        :class="{ active: reqParams.sortField === 'createTime' }">最新
      </a>
      <a href="javascript:;" @click="changeSort('praiseCount')"
        :class="{ active: reqParams.sortField === 'praiseCount' }">最热
      </a>
    </div>
    <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <!-- 评论者的信息 -->
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <!-- 实星 -->
            <i v-for="i in item.score" :key="i + 's'" class="iconfont icon-wjx01"></i>
            <!-- 空星 -->
            <i v-for="i in 5 - item.score" :key="i +'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 使用图片预览组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <XtxPagination v-if="total" @change-page="changePageFn" :total="total" :pageSize="reqParams.pageSize" :currentPage="reqParams.page" />
  </div>
</template>
<script>
// 引入api
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
// 引入vue的api
import { ref, reactive, watch } from 'vue'
// 引入vue-router
import { useRoute } from 'vue-router'
// 引入子组件
import GoodsCommentImage from './goods-comment-image'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    // 存储当前商品的数据
    const commentInfo = ref({})
    // 存储总页数
    const total = ref(0)
    // 激活索引
    const currTagIndex = ref(0)
    const changeTag = (step) => {
      // 修改active的样式
      currTagIndex.value = step
      // 点击tag的时候修改筛选条件
      const tag = commentInfo.value.tags[step]
      // 情况1：全部评论
      // 情况2： 有图
      // 情况3： 其他
      switch (tag.type) {
        case 'all':
          reqParams.hasPicture = null
          reqParams.tag = null
          reqParams.page = 1
          break
        case 'img':
          reqParams.hasPicture = true
          reqParams.tag = null
          reqParams.page = 1
          break
        default:
          reqParams.hasPicture = null
          reqParams.tag = tag.title
          reqParams.page = 1
      }
    }
    // 修改筛选条件排序
    const changeSort = (sort) => {
      reqParams.sortField = sort
      reqParams.page = 1
    }
    const route = useRoute()
    // 获取商品评价数据 发请求
    findGoodsCommentInfo(route.params.id).then(({ result }) => {
      // 追加全部评论和有图
      result.tags.unshift({ tagCount: result.hasPictureCount, title: '有图', type: 'img' })
      result.tags.unshift({ tagCount: result.evaluateCount, title: '全部评价', type: 'all' })
      total.value = result.total
      // 将数据给commentInfo
      // commentInfo = result
      commentInfo.value = result
    })
    // 准备筛选条件数据
    const reqParams = reactive({
      page: 1,
      pageSize: 20,
      hasPicture: null,
      tag: null,
      // 排序方式 praiseCount 热度 createTime 最新
      sortField: null
    })
    // 存储商品评价列表
    const commentList = ref([])
    // 初始化需要发请求，筛选条件发生改变发请求
    watch(reqParams, (newValue) => {
      // 获取评价数据
      findGoodsCommentList(route.params.id, newValue).then(({ result }) => {
        /* result.member.forEach((item) => {
          console.log(item)
        }) */
        total.value = result.counts
        commentList.value = result.items
      })
    }, { immediate: true })
    // 改变页码发请求
    const changePageFn = (newPage) => {
      reqParams.page = newPage
    }
    // 将商品规格转换
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}: ${c.nameValue}`, '').trim()
    }
    // 将评价者的名称加密
    const formatNickname = (name) => {
      // substring() 用于获取字符串中第几位字符，replace用于转化内容 /. 表任何内容跟 /g表全局
      // name.slice() 用于排除两端的字符，把中间的变成****
      return name.substring(0, 1) + name.slice(1, name.length - 1).replace(/./g, '*') + name.substring(name.length - 1)
    }
    // 将商品评价数量传递给父组件
    return { commentInfo, changeTag, currTagIndex, reqParams, commentList, changeSort, formatSpecs, formatNickname, total, changePageFn }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        >a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }

          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    >span {
      margin-left: 20px;
    }

    >a {
      margin-left: 30px;

      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }

  .list {
    padding: 0 20px;

    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;

      .user {
        width: 160px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        span {
          padding-left: 10px;
          color: #666;
        }
      }

      .body {
        flex: 1;

        .score {
          line-height: 40px;

          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }

          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }

      .text {
        color: #666;
        line-height: 24px;
      }

      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
