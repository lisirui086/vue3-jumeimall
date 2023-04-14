<template>
  <div class="member-order" v-if="orderInfo">
    <!-- 头部 -->
    <OrderDetailAction :order="orderInfo" />
    <!-- 进度 -->
    <DetailSteps :order="orderInfo" />
    <!-- 物流 -->
    <!-- 信息 -->
  </div>
</template>
<script>
// 引入子组件
import OrderDetailAction from './detail-action'
import DetailSteps from './detail-steps'
// 引入组合式API
import { ref } from 'vue'
// 引入后台接口
import { findOrderDetail } from '@/api/order'
// 引入路由
import { useRoute } from 'vue-router'
export default {
  name: 'MemberOrderDetail',
  components: { OrderDetailAction, DetailSteps },
  setup () {
    const route = useRoute()
    // 存储当前订单信息
    const orderInfo = ref(null)
    // 获取当前订单信息
    findOrderDetail(route.params.id).then(data => {
      if (data.code === '1') {
        orderInfo.value = data.result
      }
    })
    return { orderInfo }
  }
}
</script>
<style lang="less" scoped>
.member-order{
  background-color: #fff;
  height: 100%;
}
</style>
