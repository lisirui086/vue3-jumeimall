<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>{{ category.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel autoPlay :sliders="sliders" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="cate2 in category.children" :key="cate2.id">
            <router-link :to="`/category/sub/${cate2.id}`">
              <img v-lazy="cate2.picture">
              <p>{{ cate2.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>-&emsp;{{sub.name}}&emsp;-</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="g in sub.goods" :key="g.id" :goods="g" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入api
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
// 引入组合式API
import { computed, ref } from 'vue'
// 引入vuex
import { useStore } from 'vuex'
// 引入路由
import { useRoute } from 'vue-router'
// 引入子组件
import GoodsItem from '@/views/category/goods-item'
export default {
  name: 'Category',
  components: { GoodsItem },
  setup () {
    // 存储轮播图
    const sliders = ref([])
    // 获取轮播图数据
    findBanner().then(data => {
      sliders.value = data.result
    })
    const store = useStore()
    const route = useRoute()
    // 从首页选中的分类名称
    const category = computed(() => {
      // 存储当前进入的分类信息,并且作为让它已挂载不是空白的
      let cate = {}
      // 找到当前的分类信息通过id
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 存储子类信息 默认空数组
    const subList = ref([])
    findTopCategory(route.params.id).then(data => {
      subList.value = data.result.children
    })
    return { sliders, category, subList }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}</style>
