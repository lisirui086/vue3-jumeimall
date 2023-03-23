<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodsList">
      <GoodsItem v-for="goods in goodsList" :key="goods.id" :goods="goods" />
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import { findGoodsHot } from '@/api/product'
import { useRoute } from 'vue-router'
// 引入子组件
import GoodsItem from '@/views/category/goods-item'
export default {
  name: 'GoodsHot',
  components: { GoodsItem },
  props: {
    // 热榜类型
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const route = useRoute()
    const types = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    // 遍历标题
    const title = computed(() => {
      return types[props.type]
    })
    // 获取数据
    const goodsList = ref([])
    findGoodsHot({ id: route.params.id, type: props.type }).then(({ result }) => {
      goodsList.value = result
    })
    return { title, goodsList }
  }
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;

    img {
      width: 200px;
      height: 200px;
    }

    p {
      margin: 0 10px;
    }

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
