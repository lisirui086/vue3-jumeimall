<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="getFilterParams" />
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限列表加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script>
// 引入子组件
import SubBread from '@/views/category/sub/sub-bread'
import SubFilter from '@/views/category/sub/sub-filter'
import SubSort from '@/views/category/sub/sub-sort'
import GoodsItem from '@/views/category/goods-item'
// 引入组合式API
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'Sub',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 存储筛选数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取二级分类的数据
    const getData = () => {
      // 开启加载动画
      loading.value = true
      // 设置二级分类的id
      reqParams.categoryId = route.params.id
      // 发请求
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // console.log(result)
        // 如果有数据
        if (result.items.length) {
          goodsList.value.push(...result.items)
          // 下一次加载数据页面加1
          reqParams.page++
        } else {
          // 没有数据，开启数据加载完毕
          finished.value = true
        }
        // 关闭加载动画
        loading.value = false
      })
    }
    // 置空数据并根据情况重新发请求
    const resetAndRequest = (data = null) => {
      // 关闭数据加载完毕提示
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...data }
      // page变成1
      reqParams.page = 1
      // 二级分类数据置空
      goodsList.value = []
    }
    // 侦听二级分类的id变化
    watch(() => route.params.id, (newValue) => {
      if (newValue && `/category/sub/${newValue}` === route.path) {
        // 关闭数据加载完毕提示
        /* finished.value = false
        // 二级分类数据置空
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        } */
        resetAndRequest()
      }
    }, { immediate: true })
    const sortChange = (sortParams) => {
      /* // 关闭加载完毕提示
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...sortParams }
      // page变成1
      reqParams.page = 1
      goodsList.value = [] */
      resetAndRequest(sortParams)
    }
    // 获取筛选区
    const getFilterParams = (filterParams) => {
      // 关闭加载完毕提示
      /* finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...filterParams }
      // page变成1
      reqParams.page = 1
      goodsList.value = [] */
      resetAndRequest(filterParams)
    }
    return { getData, loading, finished, goodsList, sortChange, getFilterParams }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
