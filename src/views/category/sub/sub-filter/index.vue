<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(brand.id)" :class="{ active: filterData.seletedBrand === brand.id }" v-for="brand in filterData.brands" :key="brand.id"
          href="javascript:;">
          {{ brand.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="optional in filterData.saleProperties" :key="optional.id" :to="`/product/${optional.id}`">
      <div class="head">{{ optional.name }}</div>
      <div class="body">
        <a @click="changeProp(optional,prop.id)" :class="{active:optional.seleteAttr===prop.id}" v-for="prop in optional.properties" :key="prop.id"
          href="javascript:;">{{ prop.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
// 引入vuerouter、vue组合式API
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 获取二级类目筛选条件数据
    const filterData = ref(null)
    // 控制骨架动画是否开启 默认关闭
    const filterLoading = ref(false)
    // 侦听路由变化
    watch(() => route.params.id, (newValue) => {
      if (newValue && `/category/sub/${newValue}` === route.path) {
        // 获取数据前开启骨架动画
        filterLoading.value = true
        // 发请求
        findSubCategoryFilter(route.params.id).then(({ result }) => {
          // 给品牌加上默认选中，和id name
          result.seletedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          // 给所有的商品规格加上默认选中全部和全部的id和name
          result.saleProperties.forEach(option => {
            option.seleteAttr = null
            option.properties.unshift({ id: null, name: '全部' })
          })
          filterLoading.value = false
          filterData.value = result
        })
      }
    }, { immediate: true })
    // 获取筛选参数的函数
    const getFilterParams = () => {
      // 存储筛选的数据
      const obj = { brandId: null, attrs: [] }
      // 存储筛选出现的品牌id
      obj.brandId = filterData.value.seletedBrand
      // 存储筛选出来的销售数据信息 saleProperties这是所有规格的数据 数据类型是数组
      filterData.value.saleProperties.forEach(item => {
        // 如果规格属性被选中了 item.seleteAttr是选中的id
        if (item.seleteAttr) {
          // properties 是 某规格下的所有详细分类 例如：颜色： 红 黄 蓝
          // 在众多prop.id中寻找和 被选中的item.seleteAttr 相等的
          const prop = item.properties.find(prop => prop.id === item.seleteAttr)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 如果没有选择任何详细规格则置空，也就是全部 不重复发请求
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    // 品牌
    const changeBrand = (BrandId) => {
      // 如果重新点击则不发请求
      if (filterData.value.seletedBrand === BrandId) return
      // 选中的id变成绿色
      filterData.value.seletedBrand = BrandId
      // 触发emit事件
      emit('filter-change', getFilterParams())
    }
    // 规格
    const changeProp = (item, PropId) => {
      // 如果重新点击则不发请求
      if (item.seleteAttr === PropId) return
      item.seleteAttr = PropId
      // 触发emit事件
      emit('filter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 36px;
        transition: all .3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.xtx-skeleton {
  padding: 10px 0;
}
</style>
